const express = require('express');
const router = express.Router();

const applicationController = require('../controllers/application.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const {
  requireCandidate,
  requireCompletedCandidateProfile
} = require('../middlewares/candidateProfile.middleware');

/**
 * Candidate apply job
 */
router.post(
  '/',
  verifyToken,
  requireCandidate,
  requireCompletedCandidateProfile,
  applicationController.applyJob
);

/**
 * Employer xem danh sách ứng viên của 1 job
 */
router.get(
  '/job/:jobId',
  verifyToken,
  requireRole('employer'),
  applicationController.getApplicantsByJob
);

router.get(
  '/me',
  verifyToken,
  requireRole('candidate'),
  applicationController.getMyApplications
);

router.delete(
  '/:id',
  verifyToken,
  requireRole('candidate'),
  applicationController.cancelApplication
);


module.exports = router;

