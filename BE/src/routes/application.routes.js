const express = require('express');
const router = express.Router();

const applicationController = require('../controllers/application.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const {
  requireCandidate,
  requireCompletedCandidateProfile
} = require('../middlewares/candidateProfile.middleware');

/**
 * =========================
 * CANDIDATE APPLY JOB
 * POST /applications
 * =========================
 */
router.post(
  '/',
  verifyToken,
  requireCandidate,
  requireCompletedCandidateProfile,
  applicationController.applyJob
);


/**
 * CANDIDATE CHECK ĐÃ APPLY JOB CHƯA
 * GET /applications/check/:jobId
 */
router.get(
  '/check/:jobId',
  verifyToken,
  requireCandidate,
  applicationController.checkApplied
);

/**
 * =========================
 * CANDIDATE XEM JOB ĐÃ ỨNG TUYỂN
 * GET /applications/me
 * =========================
 */
router.get(
  '/me',
  verifyToken,
  requireCandidate,
  applicationController.getMyApplications
);

/**
 * =========================
 * CANDIDATE HỦY ỨNG TUYỂN (THEO application.id)
 * PATCH /applications/:id/cancel
 * =========================
 */
router.patch(
  '/:id/cancel',
  verifyToken,
  requireCandidate,
  applicationController.cancelApplication
);

/**
 * =========================
 * EMPLOYER XEM ỨNG VIÊN THEO JOB
 * GET /applications/job/:jobId
 * =========================
 */
router.get(
  '/job/:jobId',
  verifyToken,
  requireRole('employer'),
  applicationController.getApplicantsByJob
);

/**
 * =========================
 * EMPLOYER DUYỆT / TỪ CHỐI HỒ SƠ
 * PATCH /applications/:id/status
 * =========================
 */
router.patch(
  '/:id/status',
  verifyToken,
  requireRole('employer'),
  applicationController.updateApplicationStatus
);

module.exports = router;
