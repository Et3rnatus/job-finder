/*
|--------------------------------------------------------------------------
| CREATE JOB (EMPLOYER)
|--------------------------------------------------------------------------
| - 1 job chỉ thuộc 1 category
| - job có nhiều skill
| - skill phải thuộc category của job
| - status mặc định: pending
*/
const db = require("../config/db");

exports.createJob = async (req, res) => {
  const connection = await db.getConnection();
  let transactionStarted = false;

  try {
    const userId = req.user.id;

    const {
      // ===== BẮT BUỘC =====
      title,
      description,
      hiring_quantity,
      expired_at,
      employment_type,
      category_id,
      skill_ids,

      // ===== OPTIONAL =====
      job_requirements,
      benefits,

      // ===== SALARY =====
      min_salary,
      max_salary,
      is_salary_negotiable,

      // ===== THÔNG TIN BỔ SUNG =====
      location,
      experience,
      level,
      education_level,

      // ===== FIELD KHÁC =====
      working_time,
      working_day,
      application_language,
      preferred_gender,
      preferred_age_min,
      preferred_age_max,
      preferred_nationality,
    } = req.body;

    /* =========================
       VALIDATE BẮT BUỘC
    ========================= */
    if (!title) {
      return res.status(400).json({ message: "Title is required",field: "title",});
      
    }

    if (!description) {
      return res.status(400).json({ message: "Description is required",field: "description", });
    }

    if (!employment_type) {
      return res.status(400).json({ message: "Employment type is required" ,field: "employment_type",});
    }

    if (!category_id) {
      return res.status(400).json({ message: "Category is required", field: "category_id",  });
    }

    if (!Array.isArray(skill_ids) || skill_ids.length === 0) {
      return res.status(400).json({
        message: "At least one skill is required",
        field: "skill_ids",
      });
    }

    if (!hiring_quantity || Number(hiring_quantity) <= 0) {
      return res.status(400).json({
        message: "Hiring quantity must be greater than 0",
        field: "hiring_quantity", 
      });
    }

    if (!expired_at) {
      return res.status(400).json({ message: "Expired date is required",field: "expired_at", });
    }

    const expiredDate = new Date(expired_at);
    expiredDate.setHours(23, 59, 59, 999);
    if (expiredDate <= new Date()) {
      return res.status(400).json({
        message: "Expired date must be in the future",
        field: "expired_at",
      });
    }

    /* =========================
       SALARY
    ========================= */
    const isNegotiable = Number(is_salary_negotiable) === 1;

    if (!isNegotiable) {
      if (min_salary == null || max_salary == null) {
  return res.status(400).json({
    message: "Salary range is required",
    field: ["min_salary", "max_salary"],
  });
}


      if (Number(min_salary) > Number(max_salary)) {
        return res.status(400).json({
          message: "Min salary cannot be greater than max salary",field: "min_salary",
        });
      }
    }

    /* =========================
       VALIDATE PREFERRED
    ========================= */
    const allowedGender = ["any", "male", "female"];
    if (
      preferred_gender &&
      !allowedGender.includes(preferred_gender)
    ) {
      return res.status(400).json({
        message: "Invalid preferred gender",
      });
    }

    if (
      preferred_age_min &&
      preferred_age_max &&
      Number(preferred_age_min) > Number(preferred_age_max)
    ) {
      return res.status(400).json({
        message: "Invalid preferred age range",
      });
    }

    /* =========================
       EMPLOYER
    ========================= */
    const [employerRows] = await connection.query(
      "SELECT id, address FROM employer WHERE user_id = ?",
      [userId]
    );

    if (employerRows.length === 0) {
      return res
        .status(400)
        .json({ message: "Employer profile not found" });
    }

    const employerId = employerRows[0].id;
    const finalAddress = employerRows[0].address;
    const finalLocation =
      location && location.trim() !== ""
        ? location.trim()
        : null;

    if (!finalAddress) {
      return res
        .status(400)
        .json({ message: "Company address not found" });
    }

    /* =========================
       VALIDATE SKILL
    ========================= */
    const [skillRows] = await connection.query(
      `
      SELECT id
      FROM skill
      WHERE id IN (?)
        AND (
          category_id = ?
          OR category_id = (
            SELECT id FROM job_category WHERE name = 'Kỹ năng mềm'
          )
        )
      `,
      [skill_ids, category_id]
    );

    if (skillRows.length !== skill_ids.length) {
      return res.status(400).json({
        message:
          "One or more skills do not belong to the selected category or soft skills",
      });
    }

    /* =========================
       INSERT JOB
    ========================= */
    await connection.beginTransaction();
    transactionStarted = true;

    const [jobResult] = await connection.execute(
      `
      INSERT INTO job (
        employer_id,
        title,
        description,
        min_salary,
        max_salary,
        is_salary_negotiable,
        hiring_quantity,
        job_requirements,
        benefits,
        created_at,
        expired_at,
        status,
        location,
        address,
        employment_type,
        category_id,
        experience,
        level,
        education_level,
        working_time,
        working_day,
        application_language,
        preferred_gender,
        preferred_age_min,
        preferred_age_max,
        preferred_nationality
      )
      VALUES (
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        NOW(), ?, 'pending',
        ?, ?,
        ?, ?,
        ?, ?, ?,
        ?, ?,
        ?, ?, ?, ?, ?
      )
      `,
      [
        employerId,
        title,
        description,
        isNegotiable ? null : min_salary,
        isNegotiable ? null : max_salary,
        isNegotiable ? 1 : 0,
        hiring_quantity,
        job_requirements || null,
        benefits || null,
        expired_at,
        finalLocation,
        finalAddress,
        employment_type,
        category_id,
        experience || null,
        level || null,
        education_level || null,
        working_time || null,
        working_day || null,
        application_language || "vi",
        preferred_gender || "any",
        preferred_age_min || null,
        preferred_age_max || null,
        preferred_nationality || null,
      ]
    );

    const jobId = jobResult.insertId;

    /* =========================
       INSERT JOB SKILLS
    ========================= */
    for (const skillId of skill_ids) {
      await connection.execute(
        "INSERT INTO job_skill (job_id, skill_id) VALUES (?, ?)",
        [jobId, skillId]
      );
    }

    /* =========================
       UPDATE QUOTA
    ========================= */
    const [quotaResult] = await connection.execute(
      `
      UPDATE employer
      SET job_post_used = job_post_used + 1
      WHERE user_id = ?
        AND job_post_limit <> -1
      `,
      [userId]
    );

    if (quotaResult.affectedRows === 0) {
      throw new Error("Job post quota exceeded");
    }

    await connection.commit();

    return res.status(201).json({
      message:
        "Tin tuyển dụng đã được tạo và đang chờ xét duyệt",
      job_id: jobId,
    });
  } catch (error) {
    if (transactionStarted) {
      await connection.rollback();
    }
    console.error("CREATE JOB ERROR:", error);
    return res
      .status(500)
      .json({ message: "Create job failed" });
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
    const user = req.user; // có thể undefined nếu public

    let sql = `
      SELECT
        j.id,
        j.title,
        e.city AS location,
        j.employment_type,
        j.level,
        j.min_salary,
        j.max_salary,
        j.created_at,
        jc.name AS category_name,
        e.company_name,

        -- ✅ ĐÚNG THEO DB
        e.logo,

        ${
          user && user.role === "candidate"
            ? "CASE WHEN a.id IS NULL THEN 0 ELSE 1 END AS is_applied"
            : "0 AS is_applied"
        }
      FROM job j
      JOIN employer e ON j.employer_id = e.id
      JOIN job_category jc ON j.category_id = jc.id
    `;

    const params = [];

    /* =========================
      CHECK APPLY (CANDIDATE)
    ========================= */
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

    /* =========================
      ĐIỀU KIỆN HIỂN THỊ JOB
    ========================= */
    sql += `
      WHERE j.status = 'approved'
        AND (j.expired_at IS NULL OR j.expired_at > NOW())
    `;

    /* =========================
      FILTER
    ========================= */
    if (keyword) {
      sql += " AND j.title LIKE ?";
      params.push(`%${keyword}%`);
    }

    if (city) {
      sql += " AND j.location LIKE ?";
      params.push(`%${city}%`);
    }

    sql += " ORDER BY j.created_at DESC";

    const [jobs] = await db.execute(sql, params);
    if (jobs.length === 0) return res.json([]);

    /* =========================
      GET SKILLS
    ========================= */
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

    /* =========================
      MAP SKILLS
    ========================= */
    const map = {};
    jobs.forEach((j) => {
      map[j.id] = { ...j, skills: [] };
    });

    skills.forEach((s) => {
      map[s.job_id]?.skills.push(s.name);
    });

    /* =========================
      RESPONSE
    ========================= */
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


/*
|--------------------------------------------------------------------------
| FILTER JOBS (PUBLIC)
|--------------------------------------------------------------------------
| Query:
| - categoryIds=1,2
| - skillIds=3,5
| - keyword=backend
| - city=Hà Nội
*/
exports.filterJobs = async (req, res) => {
  try {
    const { categoryIds, skillIds, keyword, city } = req.query;

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
        jc.name AS category_name,
        e.company_name,
        e.logo
      FROM job j
      JOIN employer e ON j.employer_id = e.id
      JOIN job_category jc ON j.category_id = jc.id
      JOIN job_skill js ON js.job_id = j.id
      JOIN skill s ON s.id = js.skill_id
      WHERE j.status = 'approved'
        AND (j.expired_at IS NULL OR j.expired_at > NOW())
    `;

    const params = [];

    /* =========================
       CATEGORY
    ========================= */
    if (categoryIds) {
      const ids = categoryIds.split(",");
      sql += ` AND j.category_id IN (${ids.map(() => "?").join(",")})`;
      params.push(...ids);
    }

    /* =========================
       SKILL (AND)
    ========================= */
    if (skillIds) {
      const ids = skillIds.split(",");
      sql += ` AND s.id IN (${ids.map(() => "?").join(",")})`;
      params.push(...ids);

      sql += `
        GROUP BY j.id
        HAVING COUNT(DISTINCT s.id) = ?
      `;
      params.push(ids.length);
    } else {
      sql += ` GROUP BY j.id`;
    }

    /* =========================
       KEYWORD
    ========================= */
    if (keyword) {
      sql += ` AND j.title LIKE ?`;
      params.push(`%${keyword}%`);
    }

    /* =========================
       CITY
    ========================= */
    if (city) {
      sql += ` AND j.location LIKE ?`;
      params.push(`%${city}%`);
    }

    sql += ` ORDER BY j.created_at DESC`;

    const [jobs] = await db.execute(sql, params);
    if (jobs.length === 0) return res.json([]);

    /* =========================
       GET SKILLS
    ========================= */
    const jobIds = jobs.map((j) => j.id);

    const [skills] = await db.execute(
      `
      SELECT js.job_id, s.name
      FROM job_skill js
      JOIN skill s ON s.id = js.skill_id
      WHERE js.job_id IN (${jobIds.map(() => "?").join(",")})
      `,
      jobIds
    );

    const map = {};
    jobs.forEach((j) => {
      map[j.id] = { ...j, skills: [] };
    });

    skills.forEach((s) => {
      map[s.job_id]?.skills.push(s.name);
    });

    return res.json(
      Object.values(map).map((j) => ({
        ...j,
        skill_names: j.skills.join(", "),
      }))
    );
  } catch (error) {
    console.error("FILTER JOB ERROR:", error);
    return res.status(500).json({ message: "Filter jobs failed" });
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
        j.id,
        j.title,
        j.description,
        j.job_requirements,
        j.benefits,
        j.min_salary,
        j.max_salary,
        j.is_salary_negotiable,
        j.hiring_quantity,
        j.location,
        j.address,
        j.employment_type,
        j.experience,
        j.level,
        j.education_level,
        j.working_time,
        j.working_day,
        j.application_language,
        j.preferred_gender,
        j.preferred_age_min,
        j.preferred_age_max,
        j.preferred_nationality,
        j.created_at,
        j.expired_at,
        j.status,

        jc.id   AS category_id,
        jc.name AS category_name,

        e.id           AS company_id,
        e.company_name AS company_name,
        e.description  AS company_description,
        e.logo         AS logo,
        e.website      AS company_website,
        CONCAT_WS(', ', e.address_detail, e.district, e.city) AS company_address
      FROM job j
      JOIN employer e ON j.employer_id = e.id
      JOIN job_category jc ON j.category_id = jc.id
      WHERE j.id = ?
      `,
      [jobId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Công việc không tồn tại" });
    }

    const job = rows[0];

    /* =========================
       CHECK STATUS
    ========================= */
    if (job.status !== "approved") {
      return res.status(404).json({ message: "Công việc không tồn tại" });
    }

    /* =========================
       CHECK EXPIRED
    ========================= */
    if (job.expired_at && new Date(job.expired_at) < new Date()) {
      return res.status(404).json({ message: "Công việc đã hết hạn" });
    }

    /* =========================
       GET SKILLS
    ========================= */
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
