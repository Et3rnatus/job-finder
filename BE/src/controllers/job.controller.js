const pool = require('../config/db');
const {v4: uuidv4} = require('uuid');

exports.createJob = async (req, res) => {
    const {employer_id,title,description,min_salary,max_salary,location,employment_type} = req.body;

    try {
        await pool.query(
            'INSERT INTO job (id, employer_id, title, description, min_salary, max_salary, location, employment_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [uuidv4(), employer_id, title, description, min_salary, max_salary, location, employment_type]
        );
        res.json({message: 'Job created successfully'});
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.getJobs = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT j.id, j.title, j.location, j.min_salary, j.max_salary,e.company_name FROM job j JOIN employer e ON j.employer_id = e.id ORDER BY j.created_at DESC');
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.searchJobs = async (req, res) => {
    const {keyword='', location=''} = req.query;

    try{
        const [rows] = await pool.query(
            'SELECT id,title,location,min_salary,max_salary FROM job WHERE title LIKE ? AND location LIKE ? ORDER BY created_at DESC',
            [`%${keyword}%`, `%${location}%`]
        );
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.getJobDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        j.id,
        j.title,
        j.description,
        j.job_requirements,
        j.location,
        j.min_salary,
        j.max_salary,
        e.company_name,
        e.logo,
        e.website,
        e.address
      FROM job j
      JOIN employer e ON j.employer_id = e.id
      WHERE j.id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const job = rows[0];

    res.json({
      id: job.id,
      title: job.title,
      salary: `${job.min_salary} - ${job.max_salary}`,
      location: job.location,

      description: job.description,
      requirements: job.job_requirements,
      benefits: "Thưởng lễ, BHYT, nghỉ phép năm",

      company: {
        name: job.company_name,
        logo: job.logo || "https://via.placeholder.com/150",
        website: job.website,
        address: job.address,
        size: "50-100 nhân sự"
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
