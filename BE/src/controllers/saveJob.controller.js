const db = require("../config/db");

/* =========================
   LƯU CÔNG VIỆC
========================= */
exports.saveJob = async (req, res) => {
  try {
    const user = req.user;
    const { job_id } = req.body;

    if (!user || user.role !== "candidate") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!job_id) {
      return res.status(400).json({ message: "Job id is required" });
    }

    /* =========================
       LẤY CANDIDATE
    ========================= */
    const [[candidate]] = await db.execute(
      "SELECT id FROM candidate WHERE user_id = ?",
      [user.id]
    );

    if (!candidate) {
      return res.status(403).json({ message: "Forbidden" });
    }

    /* =========================
       CHECK JOB HỢP LỆ
    ========================= */
    const [[job]] = await db.execute(
      `
      SELECT id
      FROM job
      WHERE id = ?
        AND status = 'approved'
        AND expired_at > NOW()
      `,
      [job_id]
    );

    if (!job) {
      return res
        .status(400)
        .json({ message: "Job is not available to save" });
    }

    /* =========================
       SAVE JOB
    ========================= */
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
    const user = req.user;

    if (!user || user.role !== "candidate") {
      return res.json([]);
    }

    const [[candidate]] = await db.execute(
      "SELECT id FROM candidate WHERE user_id = ?",
      [user.id]
    );

    if (!candidate) {
      return res.json([]);
    }

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
        AND j.status = 'approved'
        AND j.expired_at > NOW()
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

/* =========================
   CHECK JOB ĐÃ LƯU CHƯA
========================= */
exports.checkSavedJob = async (req, res) => {
  try {
    const user = req.user;
    const { jobId } = req.params;

    if (!user || user.role !== "candidate") {
      return res.json({ saved: false });
    }

    const [[candidate]] = await db.execute(
      "SELECT id FROM candidate WHERE user_id = ?",
      [user.id]
    );

    if (!candidate) return res.json({ saved: false });

    const [[row]] = await db.execute(
      `
      SELECT id
      FROM saved_job
      WHERE candidate_id = ? AND job_id = ?
      `,
      [candidate.id, jobId]
    );

    return res.json({ saved: !!row });
  } catch (error) {
    console.error("CHECK SAVED JOB ERROR:", error);
    return res.json({ saved: false });
  }
};

/* =========================
   BỎ LƯU JOB
========================= */
exports.unsaveJob = async (req, res) => {
  try {
    const user = req.user;
    const { jobId } = req.params;

    if (!user || user.role !== "candidate") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const [[candidate]] = await db.execute(
      "SELECT id FROM candidate WHERE user_id = ?",
      [user.id]
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

    return res.json({ message: "Job unsaved successfully" });
  } catch (error) {
    console.error("UNSAVE JOB ERROR:", error);
    return res.status(500).json({ message: "Unsave job failed" });
  }
};
