const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const employerController = require('../controllers/employer.controller');
const uploadEmployerLogo = require("../middlewares/uploadEmployerLogo");

router.put(
  '/profile',
  verifyToken,
  requireRole("employer"),
  employerController.updateProfile
);

// Kiểm tra hoàn thành hồ sơ
router.get(
  "/check-profile",
  verifyToken,
  requireRole("employer"),
  employerController.checkProfile
);

// Lấy hồ sơ nhà tuyển dụng
router.get(
  "/profile",
  verifyToken,
  requireRole("employer"),
  employerController.getProfile
);

// Lấy công việc đã đăng của nhà tuyển dụng
router.get(
  "/jobs",
  verifyToken,
  requireRole("employer"),
  employerController.getMyJobs
);

// Lấy chi tiết hồ sơ ứng tuyển
router.get(
  "/applications/:applicationId",
  verifyToken,
  requireRole("employer"),
  employerController.getApplicationDetailForEmployer
);

// Gửi lại tin tuyển dụng
router.patch(
  "/jobs/:id/resubmit",
  verifyToken,
  requireRole("employer"),
  employerController.resubmitJob
);

// Cập nhật logo
router.put(
  "/logo",
  verifyToken,
  requireRole("employer"),
  uploadEmployerLogo,
  employerController.updateEmployerLogo
);

router.get(
  "/payment-history",
  verifyToken,
  requireRole("employer"),
  employerController.getPaymentHistory
);

router.get(
  "/package-status",
  verifyToken,
  requireRole("employer"),
  employerController.getPackageStatus
);

module.exports = router;
