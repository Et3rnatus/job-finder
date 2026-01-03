const db = require("../config/db");

/* =========================
   LƯU CÔNG VIỆC
========================= */
exports.saveJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { job_id } = req.body;

    if (!job_id) {
      return res.status(400).json({
        message: "Job id is required",
      });
    }

    // 1️⃣ Lấy candidate theo user
    const [[candidate]] = await db.execute(
      `SELECT id FROM candidate WHERE user_id = ?`,
      [userId]
    );

    if (!candidate) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    // 2️⃣ Lưu job
    await db.execute(
      `
      INSERT INTO saved_job (candidate_id, job_id, saved_at)
      VALUES (?, ?, NOW())
      `,
      [candidate.id, job_id]
    );

    return res.status(201).json({
      message: "Job saved successfully",
    });
  } catch (error) {
    // 🔁 Lưu trùng
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Job already saved",
      });
    }

    console.error("SAVE JOB ERROR:", error);
    return res.status(500).json({
      message: "Save job failed",
    });
  }
};

/* =========================
   DANH SÁCH JOB ĐÃ LƯU
========================= */
exports.getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Lấy candidate
    const [[candidate]] = await db.execute(
      `SELECT id FROM candidate WHERE user_id = ?`,
      [userId]
    );

    if (!candidate) {
      return res.json([]);
    }

    // 2️⃣ Lấy job đã lưu
    const [rows] = await db.execute(
      `
      SELECT
        j.id AS job_id,
        j.title,
        j.location,
        j.min_salary,
        j.max_salary,
        e.company_name,
        sj.saved_at
      FROM saved_job sj
      JOIN job j ON sj.job_id = j.id
      JOIN employer e ON j.employer_id = e.id
      WHERE sj.candidate_id = ?
      ORDER BY sj.saved_at DESC
      `,
      [candidate.id]
    );

    return res.json(rows);
  } catch (error) {
    console.error("GET SAVED JOBS ERROR:", error);
    return res.status(500).json({
      message: "Get saved jobs failed",
    });
  }
};

// GET /api/saved-jobs/check/:jobId
exports.checkSavedJob = async (req, res) => {
  const userId = req.user.id;
  const { jobId } = req.params;

  const [[candidate]] = await db.execute(
    "SELECT id FROM candidate WHERE user_id = ?",
    [userId]
  );

  if (!candidate) return res.json({ saved: false });

  const [[row]] = await db.execute(
    `
    SELECT id FROM saved_job
    WHERE candidate_id = ? AND job_id = ?
    `,
    [candidate.id, jobId]
  );

  res.json({ saved: !!row });
};

exports.unsaveJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;

    // Lấy candidate
    const [[candidate]] = await db.execute(
      "SELECT id FROM candidate WHERE user_id = ?",
      [userId]
    );

    if (!candidate) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await db.execute(
      `
      DELETE FROM saved_job
      WHERE candidate_id = ? AND job_id = ?
      `,
      [candidate.id, jobId]
    );

    res.json({ message: "Job unsaved successfully" });
  } catch (error) {
    console.error("UNSAVE JOB ERROR:", error);
    res.status(500).json({ message: "Unsave job failed" });
  }
};
