const pool = require("../config/db");

// GET EMPLOYER PROFILE
exports.getProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.user.role !== "employer") {
    return res.status(403).json({ error: "Access denied" });
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
      return res.status(404).json({ error: "Employer not found" });
    }

    return res.json(employer);
  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// UPDATE EMPLOYER PROFILE
exports.updateProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.user.role !== "employer") {
    return res.status(403).json({ error: "Access denied" });
  }

  const userId = req.user.userId;
  const { company_name, website, address, description } = req.body;

  try {
    const [[employer]] = await pool.query(
      "SELECT id FROM employer WHERE user_id = ?",
      [userId]
    );

    if (!employer) {
      return res.status(404).json({ error: "Employer not found" });
    }

    await pool.query(
      `UPDATE employer
       SET company_name = ?, website = ?, address = ?, description = ?
       WHERE id = ?`,
      [company_name, website, address, description, employer.id]
    );

    return res.json({ message: "Employer profile updated successfully" });
  } catch (error) {
    console.error("updateProfile error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};


// GET JOBS BY EMPLOYER
exports.getMyJobs = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.user.role !== "employer") {
    return res.status(403).json({ error: "Access denied" });
  }

  const userId = req.user.userId;

  try {
    const [[employer]] = await pool.query(
      "SELECT id FROM employer WHERE user_id = ?",
      [userId]
    );

    if (!employer) {
      return res.status(404).json({ error: "Employer not found" });
    }

    const [jobs] = await pool.query(
      `SELECT id, title, location, created_at
       FROM job
       WHERE employer_id = ?
       ORDER BY created_at DESC`,
      [employer.id]
    );

    return res.json(jobs);
  } catch (error) {
    console.error("getMyJobs error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// GET APPLICATIONS BY JOB
exports.getApplicationsByJob = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.user.role !== "employer") {
    return res.status(403).json({ error: "Access denied" });
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

    return res.json(applications);
  } catch (error) {
    console.error("getApplicationsByJob error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
