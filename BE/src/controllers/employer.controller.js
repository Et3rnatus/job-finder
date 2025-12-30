const db = require('../config/db');

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { company_name, description, website, address, logo } = req.body;

    // validate tối thiểu
    if (!company_name || !address) {
      return res.status(400).json({
        message: 'Company name and address are required'
      });
    }

    await db.execute(
      `
      UPDATE employer
      SET company_name = ?, description = ?, website = ?, address = ?, logo = ?, is_profile_completed = 1
      WHERE user_id = ?
      `,
      [
        company_name,
        description || null,
        website || null,
        address,
        logo || null,
        userId
      ]
    );

    res.json({ message: 'Employer profile completed' });
  } catch (error) {
    res.status(500).json({ message: 'Update employer profile failed' });
  }
};


//kiem tra profile employer da hoan thanh chua
exports.checkProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      "SELECT is_profile_completed FROM employer WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.json({ completed: false });
    }

    res.json({
      completed: rows[0].is_profile_completed === 1
    });
  } catch (error) {
    res.status(500).json({ message: "Check profile failed" });
  }
};

//lay thong tin profile employer
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      `
      SELECT
        company_name,
        email,
        logo,
        description,
        website,
        address,
        is_profile_completed
      FROM employer
      WHERE user_id = ?
      `,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Employer profile not found"
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("GET EMPLOYER PROFILE ERROR:", error);
    res.status(500).json({
      message: "Get employer profile failed"
    });
  }
};

