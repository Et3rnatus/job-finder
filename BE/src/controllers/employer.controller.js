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
