const db = require("../config/db");

// lay cung nganh nghe hien co
exports.getActiveCategories = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT id, name
      FROM job_category
      WHERE is_active = 1
      ORDER BY name
    `);

    res.json(rows);
  } catch (err) {
    console.error("GET CATEGORIES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
