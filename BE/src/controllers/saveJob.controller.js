const db = require('../config/db');

exports.saveJob = async (req, res) => {
  try {
    const candidateId = req.user.id; // lấy từ JWT
    const { job_id } = req.body;

    if (!job_id) {
      return res.status(400).json({ message: 'Job id is required' });
    }

    await db.execute(
      `
      INSERT INTO saved_jobs (candidate_id, job_id, saved_at)
      VALUES (?, ?, NOW())
      `,
      [candidateId, job_id]
    );

    res.status(201).json({ message: 'Job saved successfully' });
  } catch (error) {
    // nếu lưu trùng
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Job already saved' });
    }

    console.error('SAVE JOB ERROR:', error);
    res.status(500).json({ message: 'Save job failed' });
  }
};

//API Lấy danh sách công việc đã lưu của ứng viên
exports.getSavedJobs = async (req, res) => {
  try {
    const candidateId = req.user.id;

    const [rows] = await db.execute(
      `
      SELECT
        jobs.id,
        jobs.title,
        jobs.location,
        jobs.min_salary,
        jobs.max_salary,
        saved_jobs.saved_at
      FROM saved_jobs
      JOIN jobs ON saved_jobs.job_id = jobs.id
      WHERE saved_jobs.candidate_id = ?
      ORDER BY saved_jobs.saved_at DESC
      `,
      [candidateId]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Get saved jobs failed' });
  }
};

