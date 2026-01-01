const db = require('../config/db');

/**
 * Middleware 1:
 * - Kiểm tra user đã đăng nhập
 * - Kiểm tra role = candidate
 * - Load candidate profile theo user_id
 * - Inject req.candidate
 */
exports.requireCandidate = async (req, res, next) => {
  try {
    // 1. kiểm tra đăng nhập
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    // 2. kiểm tra role
    if (req.user.role !== 'candidate') {
      return res.status(403).json({
        message: 'Candidate access only'
      });
    }

    // 3. load candidate theo user_id
    const [rows] = await db.execute(
      `
      SELECT *
      FROM candidate
      WHERE user_id = ?
      `,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'Candidate profile not found'
      });
    }

    // 4. inject candidate vào request
    req.candidate = rows[0];

    next();
  } catch (error) {
    console.error('REQUIRE CANDIDATE ERROR:', error);
    res.status(500).json({
      message: 'Candidate authentication failed'
    });
  }
};

/**
 * Middleware 2:
 * - Kiểm tra hồ sơ ứng viên đã hoàn thiện chưa
 * - Kiểm tra có ít nhất 1 skill
 * - Dùng cho APPLY JOB
 */
exports.requireCompletedCandidateProfile = async (req, res, next) => {
  try {
    const candidate = req.candidate;

    // 1. kiểm tra cờ hoàn thiện hồ sơ
    if (!candidate.is_profile_completed) {
      return res.status(403).json({
        message: 'Please complete your profile before applying'
      });
    }

    // 2. kiểm tra có ít nhất 1 skill
    const [skillRows] = await db.execute(
      `
      SELECT 1
      FROM candidate_skill
      WHERE candidate_id = ?
      LIMIT 1
      `,
      [candidate.id]
    );

    if (skillRows.length === 0) {
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
