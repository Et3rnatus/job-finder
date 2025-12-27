const pool = require('../config/db');

exports.getAllSkills = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name FROM skill ORDER BY name ASC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
