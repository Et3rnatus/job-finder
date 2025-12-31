const db = require("../config/db");

/**
 * ================================
 * CREATE JOB (EMPLOYER)
 * ================================
 */
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
      location,              // có thể rỗng
      employment_type,
      category_id,
      skill_ids,
    } = req.body;

    /* ========== 1️⃣ VALIDATE BẮT BUỘC ========== */

    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!description) return res.status(400).json({ message: "Description is required" });
    if (!job_requirements) return res.status(400).json({ message: "Job requirements are required" });
    if (!benefits) return res.status(400).json({ message: "Benefits are required" });

    if (!employment_type) {
      return res.status(400).json({ message: "Employment type is required" });
    }

    if (!expired_at) {
      return res.status(400).json({ message: "Expired date is required" });
    }

    if (!Array.isArray(skill_ids) || skill_ids.length === 0) {
      return res.status(400).json({
        message: "At least one skill is required",
      });
    }

    if (Number(hiring_quantity) <= 0) {
      return res.status(400).json({
        message: "Hiring quantity must be greater than 0",
      });
    }

    // ✅ Fix validate ngày hết hạn (cho phép hết hạn cuối ngày)
    const expiredDate = new Date(expired_at);
    expiredDate.setHours(23, 59, 59, 999);

    if (expiredDate <= new Date()) {
      return res.status(400).json({
        message: "Expired date must be in the future",
      });
    }

    const isNegotiable = Number(is_salary_negotiable) === 1;

    if (!isNegotiable) {
      if (!min_salary || !max_salary) {
        return res.status(400).json({
          message: "Salary range is required",
        });
      }

      if (Number(min_salary) > Number(max_salary)) {
        return res.status(400).json({
          message: "Min salary cannot be greater than max salary",
        });
      }
    }

    /* ========== 2️⃣ CHECK EMPLOYER ========== */

    const [employerRows] = await connection.query(
      "SELECT id, address FROM employer WHERE user_id = ?",
      [userId]
    );

    if (employerRows.length === 0) {
      return res.status(400).json({
        message: "Employer profile not found",
      });
    }

    const employerId = employerRows[0].id;

    /* ========== 3️⃣ XÁC ĐỊNH LOCATION (QUAN TRỌNG) ========== */

    let finalLocation = location;

    // Nếu FE không gửi location → lấy từ address công ty
    if (!finalLocation || finalLocation.trim() === "") {
      if (!employerRows[0].address) {
        return res.status(400).json({
          message: "Company address not found",
        });
      }
      finalLocation = employerRows[0].address;
    }

    /* ========== 4️⃣ CHECK SKILLS ========== */

    const [skillRows] = await connection.query(
      "SELECT id FROM skill WHERE id IN (?)",
      [skill_ids]
    );

    if (skillRows.length !== skill_ids.length) {
      return res.status(400).json({
        message: "One or more skills are invalid",
      });
    }

    /* ========== 5️⃣ TRANSACTION ========== */

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
        created_at,
        expired_at,
        location,
        employment_type,
        category_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?)
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
        expired_at,
        finalLocation,          // 🔥 DÙNG LOCATION CUỐI
        employment_type,
        category_id || null,
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

    res.status(201).json({
      message: "Tin tuyển dụng đã được lưu và đang chờ xét duyệt",
      job_id: jobId,
    });
  } catch (error) {
    if (transactionStarted) await connection.rollback();
    console.error("CREATE JOB ERROR:", error);

    res.status(500).json({
      message: "Create job failed",
    });
  } finally {
    connection.release();
  }
};


/**
 * ================================
 * GET ALL JOBS (HOMEPAGE)
 * 👉 dùng cho JobList / JobCard
 * ================================
 */
exports.getAllJobs = async (req, res) => {
  try {
    // 1️⃣ lấy job cơ bản
    const [jobs] = await db.execute(
      `
      SELECT
        j.id,
        j.title,
        j.location,              
        j.employment_type,
        j.min_salary,
        j.max_salary,
        j.created_at,

        e.company_name,
        e.logo
      FROM job j
      JOIN employer e ON j.employer_id = e.id
      ORDER BY j.created_at DESC
      `
    );

    if (jobs.length === 0) {
      return res.json([]);
    }

    // 2️⃣ lấy skills
    const jobIds = jobs.map((job) => job.id);

    const [skills] = await db.execute(
      `
      SELECT
        js.job_id,
        s.id,
        s.name
      FROM job_skill js
      JOIN skill s ON js.skill_id = s.id
      WHERE js.job_id IN (${jobIds.map(() => "?").join(",")})
      `,
      jobIds
    );

    // 3️⃣ map skill vào job
    const jobMap = {};

    jobs.forEach((job) => {
      jobMap[job.id] = {
        ...job,
        skills: [],
      };
    });

    skills.forEach((skill) => {
      if (jobMap[skill.job_id]) {
        jobMap[skill.job_id].skills.push(skill.name);
      }
    });

    // 4️⃣ FE cần skill dạng string
    const result = Object.values(jobMap).map((job) => ({
      ...job,
      job_skill: job.skills.join(", "),
    }));

    res.json(result);
  } catch (error) {
    console.error("GET ALL JOBS ERROR:", error);
    res.status(500).json({
      message: "Get jobs failed",
    });
  }
};

/**
 * ================================
 * GET JOB DETAIL
 * 👉 dùng cho JobDetailPage
 * ================================
 */
exports.getJobDetail = async (req, res) => {
  try {
    const jobId = req.params.id;

    // 1️⃣ job + employer (địa chỉ chi tiết)
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
        j.employment_type,
        j.expired_at,
        j.created_at,

        e.company_name,
        e.description AS company_description,
        e.logo,
        e.website,
        e.address              
      FROM job j
      JOIN employer e ON j.employer_id = e.id
      WHERE j.id = ?
      `,
      [jobId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const job = rows[0];

    // 2️⃣ skills
    const [skills] = await db.execute(
      `
      SELECT 
        s.id,
        s.name
      FROM job_skill js
      JOIN skill s ON js.skill_id = s.id
      WHERE js.job_id = ?
      `,
      [jobId]
    );

    // 3️⃣ format cho FE
    res.json({
      id: job.id,
      title: job.title,
      description: job.description,
      job_requirements: job.job_requirements,
      benefits: job.benefits,
      min_salary: job.min_salary,
      max_salary: job.max_salary,
      is_salary_negotiable: job.is_salary_negotiable,
      hiring_quantity: job.hiring_quantity,
      location: job.location,         // 👉 hiển thị ngắn
      employment_type: job.employment_type,
      expired_at: job.expired_at,
      created_at: job.created_at,

      job_skill: skills.map((s) => s.name).join(", "),

      company: {
        name: job.company_name,
        description: job.company_description,
        logo: job.logo,
        website: job.website,
        address: job.address,       
      },
    });
  } catch (error) {
    console.error("GET JOB DETAIL ERROR:", error);
    res.status(500).json({
      message: "Get job detail failed",
    });
  }
};
