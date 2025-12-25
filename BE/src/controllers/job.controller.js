const pool = require('../config/db');
const {v4: uuidv4} = require('uuid');

exports.createJob = async (req, res) => {
    const {empolyer_id,title,description,min_salary,max_salary,location,emloyment_type} = req.body;

    try {
        await pool.query(
            'INSERT INTO jobs (id, empolyer_id, title, description, min_salary, max_salary, location, emloyment_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [uuidv4(), empolyer_id, title, description, min_salary, max_salary, location, emloyment_type]
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
            'SELECT j.id, j.title, j.location, j.min_salary, j.max_salary,e.company_nameFROM job j JOIN employer e ON j.empolyer_id = e.id ORDER BY j.created_at DESC');
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.getJobDetail = async (req, res) => {
    const {id} = req.params;

    try {
        const [rows] = await pool.query(
            'SELECT * FROM job WHERE id=?',
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({error: 'Job not found'});
        }
        res.json(rows[0]);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
}
