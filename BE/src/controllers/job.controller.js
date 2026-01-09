const db = require("../config/db");

/* =====================
   CREATE JOB
===================== */
exports.createJob = async (req, res) => {
  const connection = await db.getConnection();
  let transactionStarted = false;

  try {
    const userId = req.user.id;

    const {
      title,
      description,
      job_requirements,
      benefits,
      min_salary,
      max_salary,
      is_salary_negotiable,
      hiring_quantity,
      expired_at,
      location,
      employment_type,
      category_id,
      experience,
      level,
      education_level,
      skill_ids,
    } = req.body;

    /* ===== VALIDATE ===== */
    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!description) return res.status(400).json({ message: "Description is required" });
    if (!job_requirements) return res.status(400).json({ message: "Job requirements are required" });
    if (!benefits) return res.status(400).json({ message: "Benefits are required" });
    if (!employment_type) return res.status(400).json({ message: "Employment type is required" });
    if (!expired_at) return res.status(400).json({ message: "Expired date is required" });

    if (!Array.isArray(skill_ids) || skill_ids.length === 0) {
      return res.status(400).json({ message: "At least one skill is required" });
    }

    if (Number(hiring_quantity) <= 0) {
      return res.status(400).json({ message: "Hiring quantity must be greater than 0" });
    }

    const expiredDate = new Date(expired_at);
    expiredDate.setHours(23, 59, 59, 999);
    if (expiredDate <= new Date()) {
      return res.status(400).json({ message: "Expired date must be in the future" });
    }

    const isNegotiable = Number(is_salary_negotiable) === 1;
    if (!isNegotiable) {
      if (!min_salary || !max_salary) {
        return res.status(400).json({ message: "Salary range is required" });
      }
      if (+min_salary > +max_salary) {
        return res.status(400).json({ message: "Min salary cannot be greater than max salary" });
      }
    }

    /* ===== EMPLOYER ===== */
    const [employerRows] = await connection.query(
      "SELECT id, address FROM employer WHERE user_id = ?",
      [userId]
    );
    if (employerRows.length === 0) {
      return res.status(400).json({ message: "Employer profile not found" });
    }

    const employerId = employerRows[0].id;
    const finalLocation =
      location && location.trim() !== "" ? location : employerRows[0].address;

    if (!finalLocation) {
      return res.status(400).json({ message: "Company address not found" });
    }

    /* ===== VALIDATE SKILLS ===== */
    const [skillRows] = await connection.query(
      "SELECT id FROM skill WHERE id IN (?)",
      [skill_ids]
    );
    if (skillRows.length !== skill_ids.length) {
      return res.status(400).json({ message: "One or more skills are invalid" });
    }

    /* ===== INSERT ===== */
    await connection.beginTransaction();
    transactionStarted = true;

    const [jobResult] = await connection.execute(
      `
      INSERT INTO job (
        employer_id,
        title,
        description,
        job_requirements,
        benefits,
        min_salary,
        max_salary,
        is_salary_negotiable,
        hiring_quantity,
        location,
        employment_type,
        category_id,
        experience,
        level,
        education_level,
        status,
        created_at,
        expired_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), ?)
      `,
      [
        employerId,
        title,
        description,
        job_requirements,
        benefits,
        isNegotiable ? null : min_salary,
        isNegotiable ? null : max_salary,
        isNegotiable ? 1 : 0,
        hiring_quantity,
        finalLocation,
        employment_type,
        category_id || null,
        experience || null,
        level || null,
        education_level || null,
        expired_at,
      ]
    );

    const jobId = jobResult.insertId;

    for (const skillId of skill_ids) {
      await connection.execute(
        "INSERT INTO job_skill (job_id, skill_id) VALUES (?, ?)",
        [jobId, skillId]
      );
    }

    await connection.commit();
    return res.status(201).json({
      message: "Tin tuyển dụng đã được lưu và đang chờ xét duyệt",
      job_id: jobId,
    });
  } catch (error) {
    if (transactionStarted) await connection.rollback();
    console.error("CREATE JOB ERROR:", error);
    return res.status(500).json({ message: "Create job failed" });
  } finally {
    connection.release();
  }
};

/* =====================
   GET ALL JOBS
===================== */
exports.getAllJobs = async (req, res) => {
  try {
    const { keyword, city } = req.query;
    const user = req.user;

    let sql = `
      SELECT
        j.id,
        j.title,
        j.location,
        j.employment_type,
        j.level,
        j.min_salary,
        j.max_salary,
        j.created_at,
        e.company_name,
        e.logo,
        ${
          user && user.role === "candidate"
            ? "CASE WHEN a.id IS NULL THEN 0 ELSE 1 END AS is_applied"
            : "0 AS is_applied"
        }
      FROM job j
      JOIN employer e ON j.employer_id = e.id
    `;

    const params = [];

    if (user && user.role === "candidate") {
      sql += `
        LEFT JOIN candidate c ON c.user_id = ?
        LEFT JOIN application a
          ON a.job_id = j.id
          AND a.candidate_id = c.id
          AND a.status != 'cancelled'
      `;
      params.push(user.id);
    }

    sql += `
      WHERE j.status = 'approved'
        AND (j.expired_at IS NULL OR j.expired_at > NOW())
    `;

    if (keyword) {
      sql += " AND j.title LIKE ?";
      params.push(`%${keyword}%`);
    }

    if (city) {
      sql += " AND j.location = ?";
      params.push(city);
    }

    sql += " ORDER BY j.created_at DESC";

    const [jobs] = await db.execute(sql, params);
    if (jobs.length === 0) return res.json([]);

    const jobIds = jobs.map((j) => j.id);

    const [skills] = await db.execute(
      `
      SELECT js.job_id, s.name
      FROM job_skill js
      JOIN skill s ON js.skill_id = s.id
      WHERE js.job_id IN (${jobIds.map(() => "?").join(",")})
      `,
      jobIds
    );

    const map = {};
    jobs.forEach((j) => (map[j.id] = { ...j, skills: [] }));
    skills.forEach((s) => map[s.job_id]?.skills.push(s.name));

    return res.json(
      Object.values(map).map((j) => ({
        ...j,
        job_skill: j.skills.join(", "),
      }))
    );
  } catch (error) {
    console.error("GET ALL JOBS ERROR:", error);
    return res.status(500).json({ message: "Get jobs failed" });
  }
};


/* =====================
   GET JOB DETAIL
===================== */
exports.getJobDetail = async (req, res) => {
  try {
    const jobId = req.params.id;

    const [rows] = await db.execute(
      `
      SELECT 
        j.*,
        e.id           AS company_id,
        e.company_name AS company_name,
        e.description  AS company_description,
        e.logo         AS company_logo,
        e.website      AS company_website,
        CONCAT_WS(', ', e.address_detail, e.district, e.city) AS company_address
      FROM job j
      JOIN employer e ON j.employer_id = e.id
      WHERE j.id = ?
      `,
      [jobId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    const job = rows[0];

    if (job.status !== "approved") {
      return res.status(404).json({ message: "Công việc không còn tồn tại" });
    }

    if (job.expired_at && new Date(job.expired_at) < new Date()) {
      return res.status(404).json({ message: "Công việc đã hết hạn" });
    }

    const [skills] = await db.execute(
      `
      SELECT s.id, s.name
      FROM job_skill js
      JOIN skill s ON js.skill_id = s.id
      WHERE js.job_id = ?
      `,
      [jobId]
    );

    return res.json({
      ...job,
      skills,
    });
  } catch (error) {
    console.error("GET JOB DETAIL ERROR:", error);
    return res.status(500).json({ message: "Get job detail failed" });
  }
};

/* =====================
   CLOSE JOB
===================== */
exports.closeJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const [[job]] = await db.execute(
      `
      SELECT j.id
      FROM job j
      JOIN employer e ON e.id = j.employer_id
      WHERE j.id = ? AND e.user_id = ?
      `,
      [jobId, userId]
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await db.execute(
      `UPDATE job SET status = 'closed' WHERE id = ?`,
      [jobId]
    );

    return res.json({ message: "Job closed successfully" });
  } catch (error) {
    console.error("CLOSE JOB ERROR:", error);
    return res.status(500).json({ message: "Close job failed" });
  }
};

/* =====================
   REOPEN JOB
===================== */
exports.reopenJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const [[job]] = await db.execute(
      `
      SELECT j.id, j.expired_at
      FROM job j
      JOIN employer e ON e.id = j.employer_id
      WHERE j.id = ? AND e.user_id = ?
      `,
      [jobId, userId]
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (new Date(job.expired_at) <= new Date()) {
      return res.status(400).json({
        message: "Job đã hết hạn, không thể mở lại",
      });
    }

    await db.execute(
      `UPDATE job SET status = 'approved' WHERE id = ?`,
      [jobId]
    );

    return res.json({ message: "Job reopened successfully" });
  } catch (error) {
    console.error("REOPEN JOB ERROR:", error);
    return res.status(500).json({ message: "Reopen job failed" });
  }
};
