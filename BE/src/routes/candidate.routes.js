const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/auth.middleware');
const {
  requireCandidate
} = require('../middlewares/candidateProfile.middleware');

const candidateController = require('../controllers/candidate.controller');

// Lấy hồ sơ ứng viên
router.get(
  '/profile',
  verifyToken,
  requireCandidate,
  candidateController.getProfile
);

// Cập nhật hồ sơ ứng viên
router.put(
  '/profile',
  verifyToken,
  requireCandidate,
  candidateController.updateProfile
);

// Check trạng thái hồ sơ
router.get(
  '/check-profile',
  verifyToken,
  requireCandidate,
  candidateController.checkProfile
);

module.exports = router;
