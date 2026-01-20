const db = require("../config/db");

/**
 * GET /api/skills/by-category/:categoryId
 * Skill theo ngành nghề (cho JOB)
 */
exports.getSkillsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const [rows] = await db.execute(
      `
      SELECT id, name
      FROM skill
      WHERE category_id = ?
      ORDER BY name ASC
      `,
      [categoryId]
    );

    res.json(rows);
  } catch (error) {
    console.error("GET SKILLS BY CATEGORY ERROR:", error);
    res.status(500).json({ message: "Failed to fetch skills" });
  }
};

/**
 * GET /api/skills
 * Toàn bộ skills (cho CANDIDATE)
 */
/**
 * GET /api/skills
 * Toàn bộ skills (cho CANDIDATE)
 */
exports.getAllSkills = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        id,
        name,
        category_id,
        skill_type
      FROM skill
      ORDER BY name ASC
    `);

    res.json(rows);
  } catch (error) {
    console.error("GET ALL SKILLS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch skills" });
  }
};

