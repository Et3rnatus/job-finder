const db = require('../config/db');

/**
 * Middleware:
 * - Kiểm tra user đăng nhập
 * - Kiểm tra role = candidate
 * - Load candidate theo user_id
 * - Inject req.candidate
 */
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

/**
 * Middleware:
 * - Kiểm tra hồ sơ ứng viên đã hoàn thiện
 * - Kiểm tra có ít nhất 1 skill
 * - Dùng cho APPLY JOB
 */
exports.requireCompletedCandidateProfile = async (req, res, next) => {
  try {
    const candidate = req.candidate;

    if (!candidate.is_profile_completed) {
      return res.status(403).json({
        message: 'Please complete your profile before applying'
      });
    }

    const [[skill]] = await db.execute(
      `
      SELECT 1
      FROM candidate_skill
      WHERE candidate_id = ?
      LIMIT 1
      `,
      [candidate.id]
    );

    if (!skill) {
      return res.status(403).json({
        message: 'Please add at least one skill before applying'
      });
    }

    next();
  } catch (error) {
    console.error('CANDIDATE PROFILE CHECK ERROR:', error);
    res.status(500).json({
      message: 'Candidate profile check failed'
    });
  }
};
