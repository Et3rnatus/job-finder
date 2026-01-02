const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * POST /applications
 * Candidate apply job (BẢN CŨ – ỔN ĐỊNH)
 */
exports.applyJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { job_id, cover_letter } = req.body;

    if (!job_id) {
      return res.status(400).json({ message: 'Job id is required' });
    }

    // 1️⃣ lấy candidate
    const [[candidate]] = await db.execute(
      'SELECT id, full_name FROM candidate WHERE user_id = ?',
      [userId]
    );

    if (!candidate) {
      return res.status(403).json({ message: 'Candidate not found' });
    }

    // 2️⃣ check đã apply chưa (trừ cancelled)
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
        message: 'You have already applied for this job'
      });
    }

    // 3️⃣ insert application
    const applicationId = uuidv4();

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
        applicationId,
        job_id,
        candidate.id,
        cover_letter?.trim() || null
      ]
    );

    // 4️⃣ 🔔 notification ĐƠN GIẢN (FAIL KHÔNG ẢNH HƯỞNG APPLY)
    try {
      await db.execute(
        `
        INSERT INTO notification (user_id, title, message)
        VALUES (?, ?, ?)
        `,
        [
          userId,
          'Ứng tuyển thành công',
          'Bạn đã ứng tuyển thành công một công việc'
        ]
      );
    } catch (e) {
      console.error('NOTIFICATION ERROR (IGNORED):', e);
    }

    res.status(201).json({ message: 'Applied successfully' });
  } catch (error) {
    console.error('APPLY JOB ERROR:', error);
    res.status(500).json({ message: 'Apply job failed' });
  }
};

/**
 * GET /applications/me
 * Candidate xem job đã ứng tuyển
 */
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
        a.job_id,              -- 🔥 BẮT BUỘC PHẢI CÓ
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


/**
 * PATCH /applications/:id/cancel
 * Candidate hủy ứng tuyển (BẢN CŨ – THEO application.id)
 */
exports.cancelApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // application.id

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

/**
 * GET /applications/job/:jobId
 * Employer xem danh sách ứng viên
 */
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

/**
 * PATCH /applications/:id/status
 * Employer duyệt / từ chối hồ sơ
 */
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


/**
 * GET /applications/check/:jobId
 * Check candidate đã apply job này chưa (trừ cancelled)
 */
exports.checkApplied = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;

    if (!jobId) {
      return res.json({ applied: false });
    }

    // lấy candidate
    const [[candidate]] = await db.execute(
      'SELECT id FROM candidate WHERE user_id = ?',
      [userId]
    );

    if (!candidate) {
      return res.json({ applied: false });
    }

    // check application còn hiệu lực
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
