const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");
const transporter = require("../config/mailer");

/* =========================
   APPLY JOB
========================= */
exports.applyJob = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { job_id, cover_letter } = req.body;
    const candidate = req.candidate;

    if (!candidate) {
      return res.status(403).json({ message: "Unauthorized candidate" });
    }

    if (!job_id) {
      return res.status(400).json({ message: "Job id is required" });
    }

    await connection.beginTransaction();

    const [[job]] = await connection.execute(
      `
      SELECT j.id, j.title, j.status, j.expired_at, e.user_id AS employer_user_id
      FROM job j
      JOIN employer e ON j.employer_id = e.id
      WHERE j.id = ?
      `,
      [job_id]
    );

    if (!job) {
      await connection.rollback();
      return res.status(404).json({ message: "Công việc không tồn tại" });
    }

    if (job.status !== "approved") {
      await connection.rollback();
      return res
        .status(400)
        .json({ message: "Công việc chưa được mở tuyển dụng" });
    }

    if (job.expired_at && new Date(job.expired_at) < new Date()) {
      await connection.rollback();
      return res
        .status(400)
        .json({ message: "Công việc đã hết hạn tuyển dụng" });
    }

    const [[existed]] = await connection.execute(
      `
      SELECT id
      FROM application
      WHERE candidate_id = ?
        AND job_id = ?
        AND status != 'cancelled'
        AND is_deleted = 0
      `,
      [candidate.id, job_id]
    );

    if (existed) {
      await connection.rollback();
      return res
        .status(400)
        .json({ message: "Bạn đã ứng tuyển công việc này" });
    }

    const [[basic]] = await connection.execute(
      `
      SELECT c.full_name, c.contact_number, u.email
      FROM candidate c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
      `,
      [candidate.id]
    );

    const [skills] = await connection.execute(
      `
      SELECT s.name
      FROM candidate_skill cs
      JOIN skill s ON cs.skill_id = s.id
      WHERE cs.candidate_id = ?
      `,
      [candidate.id]
    );

    const [education] = await connection.execute(
      `
      SELECT school, degree, major, start_date, end_date
      FROM education
      WHERE candidate_id = ?
      `,
      [candidate.id]
    );

    const [experience] = await connection.execute(
      `
      SELECT company, position, start_date, end_date, description
      FROM work_experience
      WHERE candidate_id = ?
      `,
      [candidate.id]
    );

    const snapshot = {
      basic: basic || {},
      skills: skills.map((s) => s.name),
      education,
      experience,
    };

    const applicationId = uuidv4();

    await connection.execute(
      `
      INSERT INTO application (
        id,
        job_id,
        candidate_id,
        cover_letter,
        snapshot_cv_json,
        status,
        applied_at,
        is_deleted
      )
      VALUES (?, ?, ?, ?, ?, 'pending', NOW(), 0)
      `,
      [
        applicationId,
        job_id,
        candidate.id,
        cover_letter || null,
        JSON.stringify(snapshot),
      ]
    );

    await connection.execute(
      `
      INSERT INTO notification (user_id, type, title, message, related_id)
      VALUES (?, 'NEW_APPLICATION', 'Có ứng viên mới', ?, ?)
      `,
      [
        job.employer_user_id,
        `Có ứng viên mới ứng tuyển vào vị trí "${job.title}"`,
        job.id,
      ]
    );

    await connection.commit();

    res.status(201).json({
      message: "Ứng tuyển thành công",
      application_id: applicationId,
    });
  } catch (err) {
    await connection.rollback();
    console.error("APPLY JOB ERROR:", err);
    res.status(500).json({ message: "Apply job failed" });
  } finally {
    connection.release();
  }
};

/* =========================
   GET MY APPLICATIONS
========================= */
/* =========================
   GET MY APPLICATIONS (SEARCH + FILTER)
========================= */
exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const { keyword, status, from_date, to_date } = req.query;

    const [[candidate]] = await db.execute(
      `SELECT id FROM candidate WHERE user_id = ?`,
      [userId]
    );

    if (!candidate) return res.json([]);

    let conditions = `
      a.candidate_id = ?
      AND a.is_deleted = 0
    `;
    const params = [candidate.id];

    // 🔎 SEARCH BY JOB TITLE / COMPANY NAME
    if (keyword) {
      conditions += `
        AND (
          j.title LIKE ?
          OR e.company_name LIKE ?
        )
      `;
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    // 🎯 FILTER BY STATUS
    if (status) {
      conditions += ` AND a.status = ? `;
      params.push(status);
    }

    // 📅 FILTER BY DATE RANGE
    if (from_date) {
      conditions += ` AND a.applied_at >= ? `;
      params.push(from_date);
    }

    if (to_date) {
      conditions += ` AND a.applied_at <= ? `;
      params.push(to_date);
    }

    const [rows] = await db.execute(
      `
      SELECT
        a.id,
        a.job_id,
        a.status,
        a.applied_at,
        a.reject_reason,
        j.title AS job_title,
        e.company_name
      FROM application a
      JOIN job j ON a.job_id = j.id
      JOIN employer e ON j.employer_id = e.id
      WHERE ${conditions}
      ORDER BY a.applied_at DESC
      `,
      params
    );

    res.json(rows);
  } catch (error) {
    console.error("GET MY APPLICATIONS ERROR:", error);
    res.status(500).json({ message: "Failed to load applied jobs" });
  }
};


/* =========================
   DELETE ALL APPLICATION HISTORY (SOFT DELETE)
========================= */
exports.deleteApplicationHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const [[candidate]] = await db.execute(
      "SELECT id FROM candidate WHERE user_id = ?",
      [userId]
    );

    if (!candidate) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const [result] = await db.execute(
      `
      UPDATE application
      SET is_deleted = 1
      WHERE candidate_id = ?
        AND is_deleted = 0
      `,
      [candidate.id]
    );

    return res.json({
      message: "Đã xóa toàn bộ lịch sử ứng tuyển",
      deleted_count: result.affectedRows,
    });
  } catch (error) {
    console.error("DELETE ALL APPLICATION HISTORY ERROR:", error);
    res.status(500).json({ message: "Delete history failed" });
  }
};


/* =========================
   CANCEL APPLICATION
========================= */
exports.cancelApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [[candidate]] = await db.execute(
      "SELECT id FROM candidate WHERE user_id = ?",
      [userId]
    );

    if (!candidate) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const [[app]] = await db.execute(
      `
      SELECT id, status
      FROM application
      WHERE id = ?
        AND candidate_id = ?
        AND is_deleted = 0
      `,
      [id, candidate.id]
    );

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (app.status !== "pending") {
      return res.status(400).json({
        message: "Only pending applications can be cancelled",
      });
    }

    await db.execute(
      `
      UPDATE application
      SET status = 'cancelled'
      WHERE id = ?
      `,
      [id]
    );

    res.json({ message: "Application cancelled successfully" });
  } catch (error) {
    console.error("CANCEL APPLICATION ERROR:", error);
    res.status(500).json({ message: "Cancel failed" });
  }
};

/* =========================
   GET APPLICANTS BY JOB
========================= */
exports.getApplicantsByJob = async (req, res) => {
  try {
    const employerUserId = req.user.id;
    const { jobId } = req.params;

    const [rows] = await db.execute(
      `
      SELECT
        a.id AS application_id,
        a.status,
        a.applied_at,
        a.cover_letter,
        a.snapshot_cv_json
      FROM application a
      JOIN job j ON a.job_id = j.id
      JOIN employer e ON j.employer_id = e.id
      WHERE a.job_id = ?
        AND e.user_id = ?
        AND a.status != 'cancelled'
      ORDER BY a.applied_at DESC
      `,
      [jobId, employerUserId]
    );

    res.json(
      rows.map((app) => ({
        application_id: app.application_id,
        status: app.status,
        applied_at: app.applied_at,
        cover_letter: app.cover_letter,
        snapshot: app.snapshot_cv_json,
      }))
    );
  } catch (error) {
    console.error("GET APPLICANTS ERROR:", error);
    res.status(500).json({ message: "Get applicants failed" });
  }
};

/* =========================
   UPDATE RESULT AFTER INTERVIEW
========================= */
exports.updateApplicationStatus = async (req, res) => {
  try {
    const employerUserId = req.user.id;
    const { id } = req.params;
    const { status, reject_reason } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (status === "rejected" && (!reject_reason || reject_reason.trim() === "")) {
      return res.status(400).json({ message: "Reject reason is required" });
    }

    const [[row]] = await db.execute(
      `
      SELECT
        a.id,
        a.job_id,
        a.status,
        c.user_id AS candidate_user_id,
        j.title AS job_title
      FROM application a
      JOIN job j ON a.job_id = j.id
      JOIN employer e ON j.employer_id = e.id
      JOIN candidate c ON a.candidate_id = c.id
      WHERE a.id = ?
        AND e.user_id = ?
      `,
      [id, employerUserId]
    );

    if (!row) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (row.status !== "interview") {
      return res.status(400).json({
        message: "Only interviewed applications can be evaluated",
      });
    }

    await db.execute(
      `
      UPDATE application
      SET status = ?, reject_reason = ?
      WHERE id = ?
      `,
      [status, status === "rejected" ? reject_reason : null, id]
    );

    // 🔔 NOTIFICATION FOR CANDIDATE
    if (status === "approved") {
      await db.execute(
        `
        INSERT INTO notification (user_id, type, title, message, related_id)
        VALUES (?, 'APPLICATION_APPROVED', ?, ?, ?)
        `,
        [
          row.candidate_user_id,
          "Hồ sơ được duyệt",
          `Chúc mừng! Hồ sơ của bạn đã được duyệt cho vị trí "${row.job_title}".`,
          row.job_id, // ✅ INT
        ]
      );
    }

    if (status === "rejected") {
      await db.execute(
        `
        INSERT INTO notification (user_id, type, title, message, related_id)
        VALUES (?, 'APPLICATION_REJECTED', ?, ?, ?)
        `,
        [
          row.candidate_user_id,
          "Kết quả ứng tuyển",
          `Rất tiếc, hồ sơ của bạn chưa phù hợp với vị trí "${row.job_title}".`,
          row.job_id, // ✅ INT
        ]
      );
    }

    res.json({ message: "Application result updated successfully" });
  } catch (error) {
    console.error("UPDATE APPLICATION STATUS ERROR:", error);
    res.status(500).json({ message: "Update status failed" });
  }
};


/* =========================
   CHECK APPLIED JOB
========================= */
exports.checkAppliedJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;

    if (!jobId) return res.json({ applied: false });

    const [[candidate]] = await db.execute(
      "SELECT id FROM candidate WHERE user_id = ?",
      [userId]
    );

    if (!candidate) return res.json({ applied: false });

    const [[row]] = await db.execute(
      `
      SELECT id
      FROM application
      WHERE candidate_id = ?
        AND job_id = ?
        AND status != 'cancelled'
        AND is_deleted = 0
      LIMIT 1
      `,
      [candidate.id, jobId]
    );

    res.json({ applied: !!row });
  } catch (error) {
    console.error("CHECK APPLIED ERROR:", error);
    res.status(500).json({ applied: false });
  }
};

/* =========================
   GET APPLICATION DETAIL
========================= */
exports.getApplicationDetail = async (req, res) => {
  const { applicationId } = req.params;

  const [[app]] = await db.execute(
    `
    SELECT
      a.id,
      a.status,
      a.applied_at,
      a.cover_letter,
      a.snapshot_cv_json,
      j.title AS job_title
    FROM application a
    JOIN job j ON a.job_id = j.id
    WHERE a.id = ?
    `,
    [applicationId]
  );

  if (!app) {
    return res.status(404).json({ message: "Application not found" });
  }

  res.json({
    id: app.id,
    job_title: app.job_title,
    status: app.status,
    applied_at: app.applied_at,
    cover_letter: app.cover_letter,
    snapshot: app.snapshot_cv_json,
  });
};

/* =========================
   INVITE TO INTERVIEW
========================= */
exports.inviteToInterview = async (req, res) => {
  try {
    const employerUserId = req.user.id;
    const { id } = req.params;

    // 🔥 FIX TRIỆT ĐỂ: KHÔNG DESTRUCTURE TRỰC TIẾP
    const body = req.body ?? {};
    const interview_time = body.interview_time;
    const interview_location = body.interview_location;
    const interview_note = body.interview_note || null;

    /* =========================
       1️⃣ VALIDATE INPUT
    ========================= */
    if (!interview_time || !interview_location) {
      return res.status(400).json({
        message: "Interview time and location are required",
      });
    }

    /* =========================
       2️⃣ CHECK APPLICATION + PERMISSION
    ========================= */
    const [[app]] = await db.execute(
      `
      SELECT
        a.id,
        a.status,
        c.full_name,
        u.email,
        j.title AS job_title
      FROM application a
      JOIN candidate c ON a.candidate_id = c.id
      JOIN users u ON c.user_id = u.id
      JOIN job j ON a.job_id = j.id
      JOIN employer e ON j.employer_id = e.id
      WHERE a.id = ?
        AND e.user_id = ?
      `,
      [id, employerUserId]
    );

    if (!app) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (app.status !== "pending") {
      return res.status(400).json({
        message: "Only pending applications can be invited to interview",
      });
    }

    /* =========================
       3️⃣ UPDATE APPLICATION
    ========================= */
    await db.execute(
      `
      UPDATE application
      SET
        status = 'interview',
        interview_time = ?,
        interview_location = ?,
        interview_note = ?,
        interview_sent_at = NOW()
      WHERE id = ?
      `,
      [
        interview_time,
        interview_location,
        interview_note,
        id,
      ]
    );

    /* =========================
       4️⃣ SEND EMAIL (MAILTRAP)
       ❗ MAIL FAIL ≠ API FAIL
    ========================= */
    try {
      await transporter.sendMail({
        from: `"JobFinder" <no-reply@jobfinder.dev>`,
        to: app.email,
        subject: `Thư mời phỏng vấn – ${app.job_title}`,
        html: `
          <p>Xin chào <b>${app.full_name}</b>,</p>

          <p>Chúng tôi trân trọng mời bạn tham gia phỏng vấn cho vị trí
          <b>${app.job_title}</b>.</p>

          <p><b>⏰ Thời gian:</b> ${interview_time}</p>
          <p><b>📍 Địa điểm:</b> ${interview_location}</p>
          <p><b>📝 Ghi chú:</b> ${interview_note || "Không có"}</p>

          <p>Trân trọng,<br/>Bộ phận tuyển dụng</p>
        `,
      });
    } catch (mailErr) {
      console.error("MAIL ERROR (ignored):", mailErr);
    }

    return res.json({
      message: "Interview invitation sent successfully",
    });
  } catch (error) {
    console.error("INVITE INTERVIEW ERROR:", error);
    return res.status(500).json({
      message: "Invite interview failed",
    });
  }
};

