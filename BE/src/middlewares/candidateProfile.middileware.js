const db = require('../config/db');

exports.requireCompletedCandidateProfile = async (req, res, next) => {
  try {
    const candidateId = req.user.id;

    // 1. kiểm tra hồ sơ cơ bản
    const [candidateRows] = await db.execute(
      `
      SELECT full_name, contact_number, address
      FROM candidate
      WHERE user_id = ?
      `,
      [candidateId]
    );

    if (
      candidateRows.length === 0 ||
      !candidateRows[0].full_name ||
      !candidateRows[0].contact_number ||
      !candidateRows[0].address
    ) {
      return res.status(403).json({
        message: 'Please complete candidate profile before applying'
      });
    }

    // 2. kiểm tra skill
    const [skillRows] = await db.execute(
      'SELECT id FROM candidate_skill WHERE candidate_id = ?',
      [candidateId]
    );

    if (skillRows.length === 0) {
      return res.status(403).json({
        message: 'Please add at least one skill before applying'
      });
    }

    next();
  } catch (error) {
    console.error('CANDIDATE PROFILE CHECK ERROR:', error);
    res.status(500).json({ message: 'Candidate profile check failed' });
  }
};
