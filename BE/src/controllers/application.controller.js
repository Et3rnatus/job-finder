const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");

exports.applyJob = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { job_id, cover_letter } = req.body;
    const candidate = req.candidate;

    /* =========================
       VALIDATE BASIC
    ========================= */
    if (!candidate) {
      return res.status(403).json({ message: "Unauthorized candidate" });
    }

    if (!job_id) {
      return res.status(400).json({ message: "Job id is required" });
    }

    await connection.beginTransaction();

    /* =========================
       1️⃣ CHECK JOB
    ========================= */
    const [[job]] = await connection.execute(
      `
      SELECT
        j.id,
        j.title,
        j.status,
        j.expired_at,
        e.user_id AS employer_user_id
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
      return res.status(400).json({ message: "Công việc chưa được mở tuyển dụng" });
    }

    if (job.expired_at && new Date(job.expired_at) < new Date()) {
      await connection.rollback();
      return res.status(400).json({ message: "Công việc đã hết hạn tuyển dụng" });
    }

    /* =========================
       2️⃣ CHECK APPLY DUPLICATE
    ========================= */
    const [[existed]] = await connection.execute(
      `
      SELECT id
      FROM application
      WHERE candidate_id = ? AND job_id = ? AND status != 'cancelled'
      `,
      [candidate.id, job_id]
    );

    if (existed) {
      await connection.rollback();
      return res
        .status(400)
        .json({ message: "Bạn đã ứng tuyển công việc này" });
    }

    /* =========================
       3️⃣ BUILD SNAPSHOT CV
    ========================= */
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

    /* =========================
       4️⃣ INSERT APPLICATION
    ========================= */
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
        applied_at
      )
      VALUES (?, ?, ?, ?, ?, 'pending', NOW())
      `,
      [
        applicationId,
        job_id,
        candidate.id,
        cover_letter || null,
        JSON.stringify(snapshot),
      ]
    );

    /* =========================
       5️⃣ NOTIFICATION
    ========================= */
    await connection.execute(
      `
      INSERT INTO notification (user_id, type, title, message, related_id)
      VALUES (?, 'NEW_APPLICATION', 'Có ứng viên mới',
              ?, ?)
      `,
      [
        job.employer_user_id,
        `Có ứng viên mới ứng tuyển vào vị trí "${job.title}"`,
        job.id,
      ]
    );

    await connection.commit();

    return res.status(201).json({
      message: "Ứng tuyển thành công",
      application_id: applicationId,
    });
  } catch (err) {
    await connection.rollback();
    console.error("APPLY JOB ERROR:", err);
    return res.status(500).json({ message: "Apply job failed" });
  } finally {
    connection.release();
  }
};

// API xem job đã ứng tuyển của ứng viên
exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Lấy candidate theo user
    const [[candidate]] = await db.execute(
      `SELECT id FROM candidate WHERE user_id = ?`,
      [userId]
    );

    if (!candidate) {
      return res.json([]);
    }

    // 2️⃣ Lấy danh sách hồ sơ đã ứng tuyển (THÊM reject_reason)
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
      WHERE a.candidate_id = ?
      ORDER BY a.applied_at DESC
      `,
      [candidate.id]
    );

    return res.json(rows);
  } catch (error) {
    console.error("GET MY APPLICATIONS ERROR:", error);
    return res.status(500).json({
      message: "Failed to load applied jobs",
    });
  }
};



 // API hủy ứng tuyển
exports.cancelApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [[candidate]] = await db.execute(
      'SELECT id FROM candidate WHERE user_id = ?',
      [userId]
    );

    if (!candidate) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const [[app]] = await db.execute(
      `
      SELECT id, status
      FROM application
      WHERE id = ?
        AND candidate_id = ?
      `,
      [id, candidate.id]
    );

    if (!app) {
      return res.status(404).json({
        message: 'Application not found'
      });
    }

    if (app.status !== 'pending') {
      return res.status(400).json({
        message: 'Only pending applications can be cancelled'
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

    res.json({ message: 'Application cancelled successfully' });
  } catch (error) {
    console.error('CANCEL APPLICATION ERROR:', error);
    res.status(500).json({ message: 'Cancel failed' });
  }
};


 // API nhà tuyển dụng xem danh sách ứng viên

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

    const result = rows.map(app => ({
      application_id: app.application_id,
      status: app.status,
      applied_at: app.applied_at,
      cover_letter: app.cover_letter,
      snapshot: app.snapshot_cv_json
    }));

    res.json(result);
  } catch (error) {
    console.error("GET APPLICANTS ERROR:", error);
    res.status(500).json({ message: "Get applicants failed" });
  }
};



 // nhà tuyển dụng duyệt / từ chối hồ sơ

exports.updateApplicationStatus = async (req, res) => {
  try {
    const employerUserId = req.user.id;
    const { id } = req.params;
    const { status, reject_reason } = req.body;

    /* =====================
       1️⃣ VALIDATE STATUS
    ===================== */
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    /* =====================
       2️⃣ VALIDATE REJECT REASON
    ===================== */
    if (
      status === "rejected" &&
      (!reject_reason || reject_reason.trim() === "")
    ) {
      return res.status(400).json({
        message: "Reject reason is required",
      });
    }

    /* =====================
       3️⃣ CHECK EMPLOYER PERMISSION
    ===================== */
    const [[row]] = await db.execute(
      `
      SELECT a.id
      FROM application a
      JOIN job j ON a.job_id = j.id
      JOIN employer e ON j.employer_id = e.id
      WHERE a.id = ?
        AND e.user_id = ?
      `,
      [id, employerUserId]
    );

    if (!row) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    /* =====================
       4️⃣ UPDATE APPLICATION
    ===================== */
    await db.execute(
      `
      UPDATE application
      SET
        status = ?,
        reject_reason = ?
      WHERE id = ?
      `,
      [
        status,
        status === "rejected" ? reject_reason : null,
        id,
      ]
    );

    return res.json({
      message: "Application status updated successfully",
    });
  } catch (error) {
    console.error("UPDATE APPLICATION STATUS ERROR:", error);
    return res.status(500).json({
      message: "Update status failed",
    });
  }
};



// API check ứng tuyển
exports.checkAppliedJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;

    if (!jobId) {
      return res.json({ applied: false });
    }

    const [[candidate]] = await db.execute(
      'SELECT id FROM candidate WHERE user_id = ?',
      [userId]
    );

    if (!candidate) {
      return res.json({ applied: false });
    }

    const [[row]] = await db.execute(
      `
      SELECT id
      FROM application
      WHERE candidate_id = ?
        AND job_id = ?
        AND status != 'cancelled'
      LIMIT 1
      `,
      [candidate.id, jobId]
    );

    res.json({ applied: !!row });
  } catch (error) {
    console.error('CHECK APPLIED ERROR:', error);
    res.status(500).json({ applied: false });
  }
};

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


