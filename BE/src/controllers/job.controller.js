const db = require('../config/db');


//API Đăng tin tuyển dụng
exports.createJob = async (req, res) => {
  try {
    const employerId = req.user.id;

    const {
      title,
      description,
      min_salary,
      max_salary,
      is_salary_negotiable,
      hiring_quantity,
      job_requirements,
      benefits,
      expired_at,
      location,
      employment_type,
      category_id,
      skills
    } = req.body;

    // 1. validate cơ bản
    if (!title || !description) {
      return res.status(400).json({
        message: 'Title and description are required'
      });
    }

    // 2. validate skills (BẮT BUỘC)
    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        message: 'Job skills are required'
      });
    }

    // 3. tạo job
    const [jobResult] = await db.execute(
      `
      INSERT INTO jobs (
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
        location,
        employment_type,
        category_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?)
      `,
      [
        employerId,
        title,
        description,
        min_salary || null,
        max_salary || null,
        is_salary_negotiable ?? 0,
        hiring_quantity || null,
        job_requirements || null,
        benefits || null,
        expired_at || null,
        location || null,
        employment_type || null,
        category_id || null
      ]
    );

    const jobId = jobResult.insertId;

    // 4. lưu job_skill (N-N)
    const jobSkillValues = skills.map(skillId => [jobId, skillId]);

    await db.query(
      `
      INSERT INTO job_skill (job_id, skill_id)
      VALUES ?
      `,
      [jobSkillValues]
    );

    res.status(201).json({
      message: 'Job created successfully with skills'
    });
  } catch (error) {
    console.error('CREATE JOB ERROR:', error);
    res.status(500).json({ message: 'Create job failed' });
  }
};


//API Lấy danh sách tất cả tin tuyển dụng
exports.getAllJobs = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        jobs.id,
        title,
        location,
        min_salary,
        max_salary,
        created_at,
        employer.company_name
      FROM jobs
      JOIN employer ON jobs.employer_id = employer.user_id
      ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Get jobs failed' });
  }
};

// API Xem chi tiết một tin tuyển dụng
exports.getJobDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. lấy thông tin job + employer
    const [jobRows] = await db.execute(
      `
      SELECT
        jobs.id,
        jobs.title,
        jobs.description,
        jobs.min_salary,
        jobs.max_salary,
        jobs.is_salary_negotiable,
        jobs.hiring_quantity,
        jobs.job_requirements,
        jobs.benefits,
        jobs.location,
        jobs.employment_type,
        jobs.created_at,
        jobs.expired_at,

        employer.company_name,
        employer.logo,
        employer.description AS company_description,
        employer.website,
        employer.address
      FROM jobs
      JOIN employer ON jobs.employer_id = employer.user_id
      WHERE jobs.id = ?
      `,
      [id]
    );

    if (jobRows.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // 2. lấy kỹ năng yêu cầu
    const [skillRows] = await db.execute(
      `
      SELECT skills.id, skills.name
      FROM job_skill
      JOIN skills ON job_skill.skill_id = skills.id
      WHERE job_skill.job_id = ?
      `,
      [id]
    );

    res.json({
      ...jobRows[0],
      skills: skillRows
    });
  } catch (error) {
    console.error('GET JOB DETAIL ERROR:', error);
    res.status(500).json({ message: 'Get job detail failed' });
  }
};

