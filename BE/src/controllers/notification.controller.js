const pool = require('../config/db');

exports.getNotifications = async (req, res) => {
    const {user_id} = req.params;

    try{
        const [rows] = await pool.query(
            'SELECT id,title,message,is_read,created_at FROM notification WHERE user_id=? ORDER BY created_at DESC',
            [user_id]
        );
        res.json(rows);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
}