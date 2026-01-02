const express = require('express');
const router = express.Router();

const applicationController = require('../controllers/application.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const {
  requireCandidate,
  requireCompletedCandidateProfile
} = require('../middlewares/candidateProfile.middleware');

//apply job
router.post(
  '/',
  verifyToken,
  requireCandidate,
  requireCompletedCandidateProfile,
  applicationController.applyJob
);


router.get(
  '/check/:jobId',
  verifyToken,
  requireCandidate,
  applicationController.checkApplied
);


router.get(
  '/me',
  verifyToken,
  requireCandidate,
  applicationController.getMyApplications
);

router.patch(
  '/:id/cancel',
  verifyToken,
  requireCandidate,
  applicationController.cancelApplication
);


router.get(
  '/job/:jobId',
  verifyToken,
  requireRole('employer'),
  applicationController.getApplicantsByJob
);


router.patch(
  '/:id/status',
  verifyToken,
  requireRole('employer'),
  applicationController.updateApplicationStatus
);

module.exports = router;
