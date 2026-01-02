const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');


// API ứng tuyển công việc
exports.applyJob = async (req, res) => {
  try {
    const { job_id, cover_letter } = req.body;

    // 🔐 candidate đã được middleware gán
    const candidate = req.candidate;

    if (!job_id) {
      return res.status(400).json({ message: "Job id is required" });
    }

    // 1️⃣ Check job tồn tại + lấy employer_user_id
    const [[job]] = await db.execute(
      `
      SELECT j.id, j.title, e.user_id AS employer_user_id
      FROM job j
      JOIN employer e ON j.employer_id = e.id
      WHERE j.id = ?
      `,
      [job_id]
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 2️⃣ Check đã apply chưa (trừ cancelled)
    const [[existed]] = await db.execute(
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
      return res.status(400).json({
        message: "Bạn đã ứng tuyển công việc này",
      });
    }

    // 3️⃣ Insert application
    const applicationId = uuidv4();

    await db.execute(
      `
      INSERT INTO application (
        id, job_id, candidate_id, cover_letter, status, applied_at
      )
      VALUES (?, ?, ?, ?, 'pending', NOW())
      `,
      [
        applicationId,
        job_id,
        candidate.id,
        cover_letter || null,
      ]
    );

    // 4️⃣ Notification cho employer (KHÔNG ĐƯỢC LÀM FAIL APPLY)
    if (job.employer_user_id) {
      try {
        await db.execute(
          `
          INSERT INTO notification (user_id, type, title, message)
          VALUES (?, ?, ?, ?)
          `,
          [
            Number(job.employer_user_id),
            "apply_job",
            job.title,
            "Có ứng viên mới",
          ]
        );
      } catch (e) {
        console.error("NOTIFICATION ERROR (IGNORED):", e);
      }
    }

    return res.status(201).json({
      message: "Ứng tuyển thành công",
    });
  } catch (error) {
    console.error("APPLY JOB ERROR:", error);
    return res.status(500).json({
      message: "Apply job failed",
    });
  }
};




// API xem job đã ứng tuyển của ứng viên
exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const [[candidate]] = await db.execute(
      'SELECT id FROM candidate WHERE user_id = ?',
      [userId]
    );

    if (!candidate) return res.json([]);

    const [rows] = await db.execute(
      `
      SELECT
        a.id,
        a.job_id,          
        a.status,
        a.applied_at,
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

    res.json(rows);
  } catch (error) {
    console.error('GET MY APPLICATIONS ERROR:', error);
    res.status(500).json({ message: 'Failed to load applied jobs' });
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
    const userId = req.user.id;
    const { jobId } = req.params;

    const [rows] = await db.execute(
      `
      SELECT
        a.id AS application_id,
        a.status,
        a.applied_at,
        c.full_name
      FROM application a
      JOIN candidate c ON a.candidate_id = c.id
      JOIN job j ON a.job_id = j.id
      JOIN employer e ON j.employer_id = e.id
      WHERE j.id = ?
        AND e.user_id = ?
        AND a.status != 'cancelled'
      ORDER BY a.applied_at DESC
      `,
      [jobId, userId]
    );

    res.json(rows);
  } catch (error) {
    console.error('GET APPLICANTS ERROR:', error);
    res.status(500).json({ message: 'Get applicants failed' });
  }
};



 // nhà tuyển dụng duyệt / từ chối hồ sơ

exports.updateApplicationStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const [[row]] = await db.execute(
      `
      SELECT a.id
      FROM application a
      JOIN job j ON a.job_id = j.id
      JOIN employer e ON j.employer_id = e.id
      WHERE a.id = ?
        AND e.user_id = ?
      `,
      [id, userId]
    );

    if (!row) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await db.execute(
      `
      UPDATE application
      SET status = ?
      WHERE id = ?
      `,
      [status, id]
    );

    res.json({ message: 'Application status updated' });
  } catch (error) {
    console.error('UPDATE APPLICATION STATUS ERROR:', error);
    res.status(500).json({ message: 'Update status failed' });
  }
};


// API check ứng tuyển
exports.checkApplied = async (req, res) => {
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