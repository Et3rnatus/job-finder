const db = require('../config/db');

exports.requireCandidate = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Candidate access only' });
    }

    const [[candidate]] = await db.execute(
      `
      SELECT *
      FROM candidate
      WHERE user_id = ?
      `,
      [req.user.id]
    );

    if (!candidate) {
      return res.status(404).json({
        message: 'Candidate profile not found'
      });
    }

    req.candidate = candidate;
    next();
  } catch (error) {
    console.error('REQUIRE CANDIDATE ERROR:', error);
    res.status(500).json({
      message: 'Candidate authentication failed'
    });
  }
};


exports.requireCompletedCandidateProfile = async (req, res, next) => {
  const userId = req.user.id;

  const [[candidate]] = await db.execute(
    `
    SELECT id, full_name, contact_number, date_of_birth, is_profile_completed
    FROM candidate
    WHERE user_id = ?
    `,
    [userId]
  );

  if (!candidate) {
    return res.status(403).json({
      message: "Bạn cần tạo hồ sơ ứng viên trước",
    });
  }

  if (!candidate.is_profile_completed) {
    return res.status(400).json({
      message: "Vui lòng hoàn thiện hồ sơ trước khi ứng tuyển",
    });
  }

  // 🔑 QUAN TRỌNG NHẤT
  req.candidate = candidate;

  next();
};
