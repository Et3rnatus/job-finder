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
  applicationController.checkAppliedJob
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
  "/jobs/:jobId/applicants",
  verifyToken,
  requireRole("employer"),
  applicationController.getApplicantsByJob
);


router.patch(
  '/:id/status',
  verifyToken,
  requireRole('employer'),
  applicationController.updateApplicationStatus
);

router.get(
  "/:applicationId",
  verifyToken,
  requireRole("employer"),
  applicationController.getApplicationDetail
);

// Mời phỏng vấn
router.put(
  "/:id/interview",
  verifyToken,
  requireRole("employer"),
  applicationController.inviteToInterview
);


module.exports = router;
