const pool = require('../config/db');
const {v4: uuidv4} = require('uuid');

exports.saveJob = async (req, res) => {
    const {candidate_id,job_id} = req.body;

    try{
        await pool.query(
            'INSERT INTO saved_job(id,candidate_id,job_id,saved_at) VALUES(?,?,?,NOW())',
            [uuidv4(),candidate_id,job_id]
        )
        res.json({message: "Job saved successfully"});
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
};

exports.getSavedJobs = async (req, res) => {
    const {candidate_id} = req.params;

    try{
        const [rows] = await pool.query(
            'SELECT j.id,j.title,j.location,j.min_salary,j.max_salary FROM saved_job s JOIN job j ON s.job_id=j.id WHERE s.candidate_id=? ORDER BY s.saved_at DESC',
            [candidate_id]
        );
        res.json(rows);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
}