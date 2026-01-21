const db = require("../config/db");

exports.getSkillsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    
    const [[otherCategory]] = await db.execute(
      `SELECT id FROM job_category WHERE name = 'Khác' LIMIT 1`
    );

    const isOtherCategory =
      otherCategory && Number(categoryId) === otherCategory.id;

    let query = "";
    let params = [];

    if (isOtherCategory) {
      
      query = `
        SELECT id, name
        FROM skill
        WHERE skill_type = 'soft'
        ORDER BY name ASC
      `;
    } else {
      
      query = `
        SELECT id, name
        FROM skill
        WHERE 
          (category_id = ? AND skill_type = 'technical')
          OR skill_type = 'soft'
        ORDER BY name ASC
      `;
      params = [categoryId];
    }

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error("GET SKILLS BY CATEGORY ERROR:", error);
    res.status(500).json({ message: "Failed to fetch skills" });
  }
};

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

