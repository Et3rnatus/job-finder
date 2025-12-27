const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.applyJob = async (req, res) => {
  const { job_id, cover_letter } = req.body;
  const userId = req.user.userId;
  const role = req.user.role;

  if (role !== 'candidate') {
    return res.status(403).json({ error: 'Only candidates can apply' });
  }

  try {
    const [[candidate]] = await pool.query(
      'SELECT id FROM candidate WHERE user_id = ?',
      [userId]
    );

    if (!candidate) {
      return res.status(400).json({ error: 'Candidate profile not found' });
    }

    await pool.query(
      `INSERT INTO application
       (job_id, candidate_id, cover_letter, status, applied_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [
        job_id,
        candidate.id,
        cover_letter || '',
        'PENDING'
      ]
    );

    const [[employer]] = await pool.query(
      `SELECT u.id AS user_id
       FROM job j
       JOIN employer e ON j.employer_id = e.id
       JOIN users u ON e.user_id = u.id
       WHERE j.id = ?`,
      [job_id]
    );

    if (employer) {
      await pool.query(
        `INSERT INTO notification
         (user_id, message, is_read, created_at)
         VALUES (?, ?, ?, NOW())`,
        [
          employer.user_id,
          'New Job Application',
          0
        ]
      );
    }

    res.json({ message: 'Apply Successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




exports.updateStatus = async (req, res) => {
    const {id}=req.params;
    const {status}=req.body;

    const allowedStatuses = ['PENDING', 'ACCEPTED', 'REJECTED'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    
    try{
        const [result] = await pool.query(
            'UPDATE application SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Application not found' });
        }
        res.json({message:'Status Updated Successfully'});  
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

