const express = require('express');
const router = express.Router();

const applicationController = require('../controllers/application.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { requireCompletedCandidateProfile } = require('../middlewares/candidateProfile.middleware');

// chỉ cho phép ứng viên nộp đơn ứng tuyển
router.post(
  '/',
  verifyToken,
  requireRole('candidate'),
  requireCompletedCandidateProfile,
  applicationController.applyJob
);

//xem danh sách ứng viên ứng tuyển cho một job
router.get(
  '/job/:jobId',
  verifyToken,
  requireRole('employer'),
  applicationController.getApplicantsByJob
);


module.exports = router;
