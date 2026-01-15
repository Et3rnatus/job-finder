const express = require("express");
const router = express.Router();

const applicationController = require("../controllers/application.controller");
const { verifyToken, requireRole } = require("../middlewares/auth.middleware");
const {
  requireCandidate,
  requireCompletedCandidateProfile,
} = require("../middlewares/candidateProfile.middleware");

/* =========================
   CANDIDATE
========================= */

// Apply job
router.post(
  "/",
  verifyToken,
  requireCandidate,
  requireCompletedCandidateProfile,
  applicationController.applyJob
);

// Check applied job
router.get(
  "/check/:jobId",
  verifyToken,
  requireCandidate,
  applicationController.checkAppliedJob
);

// Get my applications (search / filter)
router.get(
  "/me",
  verifyToken,
  requireCandidate,
  applicationController.getMyApplications
);

// Cancel application
router.patch(
  "/:id/cancel",
  verifyToken,
  requireCandidate,
  applicationController.cancelApplication
);

// 🗑 DELETE ALL APPLICATION HISTORY (SOFT DELETE)
router.delete(
  "/history",
  verifyToken,
  requireCandidate,
  applicationController.deleteApplicationHistory
);

/* =========================
   EMPLOYER
========================= */

// Employer view applicants by job
router.get(
  "/jobs/:jobId/applicants",
  verifyToken,
  requireRole("employer"),
  applicationController.getApplicantsByJob
);

// Update application status
router.patch(
  "/:id/status",
  verifyToken,
  requireRole("employer"),
  applicationController.updateApplicationStatus
);

// Employer view application detail
router.get(
  "/:applicationId",
  verifyToken,
  requireRole("employer"),
  applicationController.getApplicationDetail
);

// Invite to interview
router.put(
  "/:id/interview",
  verifyToken,
  requireRole("employer"),
  applicationController.inviteToInterview
);

module.exports = router;
