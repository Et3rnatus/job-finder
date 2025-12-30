const db = require('../config/db');

exports.requireCompletedEmployerProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      'SELECT is_profile_completed FROM employer WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0 || rows[0].is_profile_completed === 0) {
      return res.status(403).json({
        message: 'Please complete employer profile before posting job'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Employer profile check failed' });
  }
};
