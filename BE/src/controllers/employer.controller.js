const pool = require('../config/db');

exports.getProfile = async (req, res) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const userId = req.user.userId;

  try {
    const [[employer]] = await pool.query(
      `SELECT id, company_name, website, address, description
       FROM employer
       WHERE user_id = ?`,
      [userId]
    );

    if (!employer) {
      return res.status(404).json({ error: 'Employer not found' });
    }

    res.json(employer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const userId = req.user.userId;
  const { company_name, website, address, description } = req.body;

  try {
    const [[employer]] = await pool.query(
      'SELECT id FROM employer WHERE user_id = ?',
      [userId]
    );

    if (!employer) {
      return res.status(404).json({ error: 'Employer not found' });
    }

    await pool.query(
      `UPDATE employer
       SET company_name=?, website=?, address=?, description=?
       WHERE id=?`,
      [company_name, website, address, description, employer.id]
    );

    res.json({ message: 'Employer profile updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyJobs = async (req, res) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const userId = req.user.userId;

  try {
    const [[employer]] = await pool.query(
      'SELECT id FROM employer WHERE user_id = ?',
      [userId]
    );

    const [jobs] = await pool.query(
      `SELECT id, title, location, created_at
       FROM job
       WHERE employer_id = ?
       ORDER BY created_at DESC`,
      [employer.id]
    );

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getApplicationsByJob = async (req, res) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { jobId } = req.params;

  try {
    const [applications] = await pool.query(
      `SELECT a.id, a.status, a.applied_at,
              c.full_name, c.contact_number
       FROM application a
       JOIN candidate c ON a.candidate_id = c.id
       WHERE a.job_id = ?
       ORDER BY a.applied_at DESC`,
      [jobId]
    );

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
