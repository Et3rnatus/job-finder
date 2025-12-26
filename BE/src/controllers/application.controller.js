const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.applyJob = async (req, res) => {
    const {job_id,candidate_id,cover_letter} = req.body;

    try{
        await pool.query(
            'INSERT INTO application(id, job_id, candidate_id, cover_letter, status, applied_at) VALUES (?, ?, ?, ?, ?, NOW())',
            [
                uuidv4(),
                job_id,
                candidate_id,
                cover_letter || '',
                'PENDING'
            ]
        );
        const [[employer]] = await pool.query(
            'SELECT u.id as user_id FROM job j JOIN employer e ON j.employer_id = e.id JOIN users u ON e.user_id = u.id WHERE j.id = ?',
            [job_id]
        );
        await pool.query(
            'INSERT INTO notification(id,user_id,message,is_read,created_at) VALUES (?, ?, ?, ?, NOW())',
            [
                uuidv4(),
                employer.user_id,
                'New Job Application',0
            ]
        );  
        res.json({message:'Apply Successfully'}); 
    } 
    catch (error) {
        res.status(500).json({error:error.message});
    }
};

exports.getByCandidate = async (req, res) => {
    const {candidate_id} = req.params;

    try{
        const[rows] = await pool.query(
            'SELECT a.id, a.job_id, a.status, a.applied_at, j.title, j.location FROM application a LEFT JOIN job j ON a.job_id = j.id WHERE a.candidate_id = ? ORDER BY a.applied_at DESC',[candidate_id]
        );
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({error:error.message});
    }
};