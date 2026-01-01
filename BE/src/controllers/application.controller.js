const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * POST /applications
 * Candidate apply job
 */
exports.applyJob = async (req, res) => {
  try {
    const candidateId = req.candidate.id;
    const { job_id, cover_letter } = req.body;

    // 1️⃣ validate input
    if (!job_id) {
      return res.status(400).json({
        message: 'Job id is required'
      });
    }

    // 2️⃣ kiểm tra job tồn tại & còn hiệu lực
    const [jobRows] = await db.execute(
      `
      SELECT id
      FROM job
      WHERE id = ?
        AND (expired_at IS NULL OR expired_at > NOW())
      `,
      [job_id]
    );

    if (jobRows.length === 0) {
      return res.status(400).json({
        message: 'Job is not available for application'
      });
    }

    // 3️⃣ insert application
    await db.execute(
      `
      INSERT INTO application (
        id,
        job_id,
        candidate_id,
        cover_letter,
        status,
        applied_at
      )
      VALUES (?, ?, ?, ?, 'pending', NOW())
      `,
      [
        uuidv4(),
        job_id,
        candidateId,
        cover_letter?.trim() || null
      ]
    );

    res.status(201).json({
      message: 'Applied successfully'
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        message: 'You have already applied for this job'
      });
    }

    console.error('APPLY JOB ERROR:', error);
    res.status(500).json({
      message: 'Apply job failed'
    });
  }
};

/**
 * GET /applications/me
 * Candidate xem danh sách job đã ứng tuyển
 */
exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id; // 🔥 FIX Ở ĐÂY

    const [[candidate]] = await db.execute(
      'SELECT id FROM candidate WHERE user_id = ?',
      [userId]
    );

    if (!candidate) {
      return res.json([]);
    }

    const [rows] = await db.execute(
      `
      SELECT
        a.id,
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
    res.status(500).json({
      message: 'Failed to load applied jobs'
    });
  }
};


/**
 * GET /jobs/:jobId/applicants
 * Employer xem danh sách ứng viên
 */
exports.getApplicantsByJob = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { jobId } = req.params;

    // 1️⃣ kiểm tra job thuộc employer
    const [jobRows] = await db.execute(
      `
      SELECT id
      FROM job
      WHERE id = ?
        AND employer_id = ?
      `,
      [jobId, employerId]
    );

    if (jobRows.length === 0) {
      return res.status(403).json({
        message: 'You do not have permission to view applicants for this job'
      });
    }

    // 2️⃣ lấy danh sách ứng viên
    const [rows] = await db.execute(
      `
      SELECT
        a.id AS application_id,
        a.status,
        a.applied_at,
        a.cover_letter,
        c.full_name,
        c.contact_number,
        c.address
      FROM application a
      JOIN candidate c ON a.candidate_id = c.id
      WHERE a.job_id = ?
      ORDER BY a.applied_at DESC
      `,
      [jobId]
    );

    res.json(rows);
  } catch (error) {
    console.error('GET APPLICANTS ERROR:', error);
    res.status(500).json({
      message: 'Get applicants failed'
    });
  }
};

/**
 * DELETE /applications/:id
 * Candidate hủy ứng tuyển (chỉ khi pending)
 */
exports.cancelApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // 1️⃣ resolve candidate
    const [[candidate]] = await db.execute(
      'SELECT id FROM candidate WHERE user_id = ?',
      [userId]
    );

    if (!candidate) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // 2️⃣ kiểm tra application thuộc candidate
    const [[app]] = await db.execute(
      `
      SELECT id, status
      FROM application
      WHERE id = ? AND candidate_id = ?
      `,
      [id, candidate.id]
    );

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    // 3️⃣ chỉ cho hủy khi pending
    if (app.status !== "pending") {
      return res.status(400).json({
        message: "Only pending applications can be cancelled",
      });
    }

    // 4️⃣ delete
    await db.execute(
      'DELETE FROM application WHERE id = ?',
      [id]
    );

    res.json({ message: "Application cancelled successfully" });
  } catch (error) {
    console.error("CANCEL APPLICATION ERROR:", error);
    res.status(500).json({ message: "Cancel failed" });
  }
};
