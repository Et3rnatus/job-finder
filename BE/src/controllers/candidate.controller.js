const pool = require('../config/db');

exports.checkProfile = async (req, res) => {
  const userId = req.user.userId;

  try {
    const [[candidate]] = await pool.query(
      'SELECT id, full_name, contact_number, address FROM candidate WHERE user_id = ?',
      [userId]
    );

    if (!candidate) {
      return res.json({ completed: false });
    }

    // Hàm check rỗng an toàn
    const isEmpty = (value) => {
      return !value || value.trim() === '';
    };

    if (
      isEmpty(candidate.full_name) ||
      isEmpty(candidate.contact_number) ||
      isEmpty(candidate.address)
    ) {
      return res.json({ completed: false });
    }

    // Check có ít nhất 1 skill
    const [skills] = await pool.query(
      'SELECT id FROM candidate_skill WHERE candidate_id = ?',
      [candidate.id]
    );

    if (skills.length === 0) {
      return res.json({ completed: false });
    }

    res.json({ completed: true });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
