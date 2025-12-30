const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.applyJob = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const { job_id, cover_letter } = req.body;

    // 1. validate input
    if (!job_id) {
      return res.status(400).json({
        message: 'Job id is required'
      });
    }

    // 2. kiểm tra job có tồn tại không
    const [jobRows] = await db.execute(
      'SELECT id FROM jobs WHERE id = ?',
      [job_id]
    );

    if (jobRows.length === 0) {
      return res.status(404).json({
        message: 'Job not found'
      });
    }

    // 3. insert application
    await db.execute(
      `
      INSERT INTO application (
        id,
        job_id,
        candidate_id,
        cover_letter,
        status,
        applied_at
      ) VALUES (?, ?, ?, ?, 'pending', NOW())
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
    // apply trùng job
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

// Xem danh sách ứng viên đã ứng tuyển cho một job
exports.getApplicantsByJob = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { jobId } = req.params;

    // 1. kiểm tra job có thuộc employer không
    const [jobRows] = await db.execute(
      'SELECT id FROM jobs WHERE id = ? AND employer_id = ?',
      [jobId, employerId]
    );

    if (jobRows.length === 0) {
      return res.status(403).json({
        message: 'You do not have permission to view applicants for this job'
      });
    }

    // 2. lấy danh sách ứng viên
    const [rows] = await db.execute(
      `
      SELECT
        application.id AS application_id,
        application.status,
        application.applied_at,
        application.cover_letter,

        candidate.full_name,
        candidate.email,
        candidate.contact_number,
        candidate.address
      FROM application
      JOIN candidate ON application.candidate_id = candidate.user_id
      WHERE application.job_id = ?
      ORDER BY application.applied_at DESC
      `,
      [jobId]
    );

    res.json(rows);
  } catch (error) {
    console.error('GET APPLICANTS ERROR:', error);
    res.status(500).json({ message: 'Get applicants failed' });
  }
};
