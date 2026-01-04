
// API ứng tuyển công việc
const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");

exports.applyJob = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { job_id, cover_letter } = req.body;
    const candidate = req.candidate;

    if (!job_id) {
      return res.status(400).json({ message: "Job id is required" });
    }

    if (!candidate || !candidate.id) {
      return res.status(401).json({ message: "Unauthorized candidate" });
    }

    await connection.beginTransaction();

    /* =====================
       1️⃣ CHECK JOB
    ===================== */
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
      throw new Error("Job not found");
    }

    if (job.status !== "approved") {
      throw new Error("Công việc chưa được phê duyệt hoặc không còn nhận hồ sơ");
    }

    if (job.expired_at && new Date(job.expired_at) < new Date()) {
      await connection.execute(
        `UPDATE job SET status = 'expired' WHERE id = ?`,
        [job.id]
      );
      throw new Error("Công việc đã hết hạn");
    }

    /* =====================
       2️⃣ CHECK APPLY TRÙNG
    ===================== */
    const [[existed]] = await connection.execute(
      `
      SELECT id
      FROM application
      WHERE candidate_id = ?
        AND job_id = ?
        AND status != 'cancelled'
      `,
      [candidate.id, job_id]
    );

    if (existed) {
      throw new Error("Bạn đã ứng tuyển công việc này");
    }

    /* =====================
       3️⃣ INSERT APPLICATION
    ===================== */
    const applicationId = uuidv4();

    await connection.execute(
      `
      INSERT INTO application (
        id,
        job_id,
        candidate_id,
        cover_letter,
        status,
        reject_reason,
        applied_at
      )
      VALUES (?, ?, ?, ?, 'pending', NULL, NOW())
      `,
      [applicationId, job_id, candidate.id, cover_letter || null]
    );

    /* =====================
       4️⃣ SNAPSHOT BASIC PROFILE
    ===================== */
    const [[candidateInfo]] = await connection.execute(
      `
      SELECT
        c.full_name,
        c.contact_number AS phone,
        u.email
      FROM candidate c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
      `,
      [candidate.id]
    );

    if (!candidateInfo) {
      throw new Error("Candidate profile not found");
    }

    const [snapshotResult] = await connection.execute(
      `
      INSERT INTO application_snapshot (
        application_id,
        full_name,
        email,
        phone,
        created_at
      )
      VALUES (?, ?, ?, ?, NOW())
      `,
      [
        applicationId,
        candidateInfo.full_name,
        candidateInfo.email,
        candidateInfo.phone || null,
      ]
    );

    const applicationSnapshotId = snapshotResult.insertId;

    /* =====================
       5️⃣ SNAPSHOT SKILLS
    ===================== */
    const [skills] = await connection.execute(
      `
      SELECT s.name
      FROM candidate_skill cs
      JOIN skill s ON cs.skill_id = s.id
      WHERE cs.candidate_id = ?
      `,
      [candidate.id]
    );

    for (const skill of skills) {
      await connection.execute(
        `
        INSERT INTO application_snapshot_skill (
          application_snapshot_id,
          skill_name
        )
        VALUES (?, ?)
        `,
        [applicationSnapshotId, skill.name]
      );
    }

    /* =====================
       6️⃣ SNAPSHOT EXPERIENCE
    ===================== */
    const [experiences] = await connection.execute(
      `
      SELECT company, position, start_date, end_date, description
      FROM work_experience
      WHERE candidate_id = ?
      `,
      [candidate.id]
    );

    for (const exp of experiences) {
      await connection.execute(
        `
        INSERT INTO application_snapshot_experience (
          application_snapshot_id,
          company,
          position,
          start_date,
          end_date,
          description
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          applicationSnapshotId,
          exp.company || null,
          exp.position || null,
          exp.start_date || null,
          exp.end_date || null,
          exp.description || null,
        ]
      );
    }

    /* =====================
       7️⃣ SNAPSHOT EDUCATION (UPDATED – CHUẨN NGHIỆP VỤ)
    ===================== */
    const [educations] = await connection.execute(
      `
      SELECT
        level,
        institution,
        major,
        status,
        school,
        degree,
        start_date,
        end_date
      FROM education
      WHERE candidate_id = ?
      `,
      [candidate.id]
    );

    for (const edu of educations) {
      await connection.execute(
        `
        INSERT INTO application_snapshot_education (
          application_snapshot_id,

          -- NEW SCHEMA (ƯU TIÊN)
          level,
          institution,
          status,
          major,

          -- LEGACY (GIỮ TƯƠNG THÍCH)
          school,
          degree,
          start_date,
          end_date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          applicationSnapshotId,

          // new
          edu.level || null,
          edu.institution || null,
          edu.status || null,
          edu.major || null,

          // legacy fallback
          edu.school || edu.institution || null,
          edu.degree || edu.level || null,
          edu.start_date || null,
          edu.end_date || null,
        ]
      );
    }

    /* =====================
       8️⃣ NOTIFICATION
    ===================== */
    if (job.employer_user_id) {
      await connection.execute(
        `
        INSERT INTO notification (
          user_id,
          type,
          title,
          message,
          related_id
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          Number(job.employer_user_id),
          "NEW_APPLICATION",
          "Có ứng viên mới",
          `Có ứng viên mới ứng tuyển vào vị trí ${job.title}`,
          job.id,
        ]
      );
    }

    await connection.commit();

    return res.status(201).json({
      message: "Ứng tuyển thành công",
      application_id: applicationId,
    });

  } catch (error) {
    await connection.rollback();
    console.error("APPLY JOB ERROR:", error);

    return res.status(400).json({
      message: error.message || "Apply job failed",
    });
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

    /**
     * 1. Lấy danh sách ứng viên apply job
     */
    const [applications] = await db.execute(
      `
      SELECT
        a.id AS application_id,
        a.status,
        a.applied_at,
        a.cover_letter,

        c.id AS candidate_id,
        c.full_name,
        u.email
      FROM application a
      JOIN candidate c ON a.candidate_id = c.id
      JOIN users u ON c.user_id = u.id
      JOIN job j ON a.job_id = j.id
      JOIN employer e ON j.employer_id = e.id
      WHERE a.job_id = ?
        AND e.user_id = ?
        AND a.status != 'cancelled'
      ORDER BY a.applied_at DESC
      `,
      [jobId, employerUserId]
    );

    if (applications.length === 0) {
      return res.json([]);
    }

    const candidateIds = applications.map((a) => a.candidate_id);

    /**
     * 2. Lấy kỹ năng
     */
    const [skills] = await db.execute(
      `
      SELECT
        cs.candidate_id,
        s.name
      FROM candidate_skill cs
      JOIN skill s ON cs.skill_id = s.id
      WHERE cs.candidate_id IN (${candidateIds.map(() => "?").join(",")})
      `,
      candidateIds
    );

    /**
     * 3. Lấy kinh nghiệm làm việc
     */
    const [experiences] = await db.execute(
      `
      SELECT
        candidate_id,
        company,
        position,
        start_date,
        end_date,
        description
      FROM work_experience
      WHERE candidate_id IN (${candidateIds.map(() => "?").join(",")})
      `,
      candidateIds
    );

    /**
     * 4. Lấy học vấn
     */
    const [educations] = await db.execute(
      `
      SELECT
        candidate_id,
        school,
        degree,
        major,
        start_date,
        end_date
      FROM education
      WHERE candidate_id IN (${candidateIds.map(() => "?").join(",")})
      `,
      candidateIds
    );

    /**
     * 5. Gom dữ liệu
     */
    const result = applications.map((app) => ({
      application_id: app.application_id,
      status: app.status,
      applied_at: app.applied_at,
      cover_letter: app.cover_letter,

      candidate: {
        id: app.candidate_id,
        full_name: app.full_name,
        email: app.email,
        phone: app.phone,
        skills: skills
          .filter((s) => s.candidate_id === app.candidate_id)
          .map((s) => s.name),
        experiences: experiences.filter(
          (e) => e.candidate_id === app.candidate_id
        ),
        educations: educations.filter(
          (e) => e.candidate_id === app.candidate_id
        ),
      },
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
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    let application;
    let candidateId;

    /* =====================================
       1️⃣ LẤY APPLICATION THEO ROLE
    ===================================== */

    if (role === "employer") {
      // EMPLOYER: chỉ xem hồ sơ của job mình đăng
      [[application]] = await db.execute(
        `
        SELECT
          a.id AS application_id,
          a.status,
          a.applied_at,
          a.cover_letter,

          c.id AS candidate_id,
          c.full_name,
          c.contact_number,

          u.email
        FROM application a
        JOIN candidate c ON a.candidate_id = c.id
        JOIN users u ON c.user_id = u.id
        JOIN job j ON a.job_id = j.id
        JOIN employer e ON j.employer_id = e.id
        WHERE a.id = ?
          AND e.user_id = ?
        `,
        [applicationId, userId]
      );
    } else if (role === "candidate") {
      // CANDIDATE: chỉ xem hồ sơ của chính mình
      const [[candidate]] = await db.execute(
        `SELECT id FROM candidate WHERE user_id = ?`,
        [userId]
      );

      if (!candidate) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      [[application]] = await db.execute(
        `
        SELECT
          a.id AS application_id,
          a.status,
          a.applied_at,
          a.cover_letter,

          c.id AS candidate_id,
          c.full_name,
          c.contact_number,

          u.email
        FROM application a
        JOIN candidate c ON a.candidate_id = c.id
        JOIN users u ON c.user_id = u.id
        WHERE a.id = ?
          AND a.candidate_id = ?
        `,
        [applicationId, candidate.id]
      );
    } else {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    candidateId = application.candidate_id;

    /* =====================================
       2️⃣ SNAPSHOT – SKILLS
    ===================================== */
    const [skills] = await db.execute(
      `
      SELECT s.name
      FROM candidate_skill cs
      JOIN skill s ON cs.skill_id = s.id
      WHERE cs.candidate_id = ?
      `,
      [candidateId]
    );

    /* =====================================
       3️⃣ SNAPSHOT – EXPERIENCE
    ===================================== */
    const [experiences] = await db.execute(
      `
      SELECT
        company,
        position,
        start_date,
        end_date,
        description
      FROM work_experience
      WHERE candidate_id = ?
      ORDER BY start_date DESC
      `,
      [candidateId]
    );

    /* =====================================
       4️⃣ SNAPSHOT – EDUCATION
    ===================================== */
    const [educations] = await db.execute(
      `
      SELECT
        school,
        degree,
        major,
        start_date,
        end_date
      FROM education
      WHERE candidate_id = ?
      ORDER BY start_date DESC
      `,
      [candidateId]
    );

    /* =====================================
       5️⃣ RESPONSE
    ===================================== */
    return res.json({
      application_id: application.application_id,
      status: application.status,
      applied_at: application.applied_at,
      cover_letter: application.cover_letter,

      candidate: {
        id: candidateId,
        full_name: application.full_name,
        email: application.email,
        contact_number: application.contact_number,
        skills: skills.map((s) => s.name),
        experiences,
        educations,
      },
    });
  } catch (error) {
    console.error("GET APPLICATION DETAIL ERROR:", error);
    return res.status(500).json({
      message: "Get application detail failed",
    });
  }
};

