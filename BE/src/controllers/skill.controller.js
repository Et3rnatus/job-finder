const db = require('../config/db');

exports.getAllSkills = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name FROM skill ORDER BY name ASC"
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("GET SKILLS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch skills",
    });
  }
};

