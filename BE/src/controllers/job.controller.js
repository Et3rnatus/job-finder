const db = require("../config/db");

//Đăng tin tuyển dụng
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
      skill_ids,
    } = req.body;



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


    let finalLocation = location;

 
    if (!finalLocation || finalLocation.trim() === "") {
      if (!employerRows[0].address) {
        return res.status(400).json({
          message: "Company address not found",
        });
      }
      finalLocation = employerRows[0].address;
    }

   

    const [skillRows] = await connection.query(
      "SELECT id FROM skill WHERE id IN (?)",
      [skill_ids]
    );

    if (skillRows.length !== skill_ids.length) {
      return res.status(400).json({
        message: "One or more skills are invalid",
      });
    }

  

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
        finalLocation,          
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


//Lấy danh sách job
exports.getAllJobs = async (req, res) => {
  try {
    const { keyword, city } = req.query;
    const user = req.user; // 👈 THÊM

    let sql = `
      SELECT
        j.id,
        j.title,
        j.location,
        j.employment_type,
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

    // 👇 THÊM JOIN để check đã apply chưa
    if (user && user.role === "candidate") {
      sql += `
        LEFT JOIN application a
          ON j.id = a.job_id
          AND a.candidate_id = ?
      `;
      params.push(user.id);
    }

    sql += ` WHERE 1 = 1 `;

    // 🔍 tìm theo tên công việc
    if (keyword && keyword.trim() !== "") {
      sql += " AND j.title LIKE ?";
      params.push(`%${keyword}%`);
    }

    // 📍 lọc theo địa điểm
    if (city && city.trim() !== "") {
      sql += " AND j.location = ?";
      params.push(city);
    }

    sql += " ORDER BY j.created_at DESC";

    const [jobs] = await db.execute(sql, params);

    if (jobs.length === 0) {
      return res.json([]);
    }

    const jobIds = jobs.map((job) => job.id);

    const [skills] = await db.execute(
      `
      SELECT
        js.job_id,
        s.name
      FROM job_skill js
      JOIN skill s ON js.skill_id = s.id
      WHERE js.job_id IN (${jobIds.map(() => "?").join(",")})
      `,
      jobIds
    );

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



//Lấy thông tin chi tiết của tin tuyển dụnng
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
      location: job.location,     
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
