const db = require("../config/db");

// GET /api/categories
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
