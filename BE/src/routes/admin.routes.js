const express = require("express");
const router = express.Router();

const {
  verifyToken,
  requireRole,
} = require("../middlewares/auth.middleware");

const adminController = require("../controllers/admin.controller");

/* =====================================
   ADMIN ROUTES
===================================== */
router.use(verifyToken, requireRole("admin"));

/* =====================
   DASHBOARD
===================== */
router.get("/dashboard", adminController.dashboard);
router.get("/dashboard/trends", adminController.dashboardTrends);
router.get("/dashboard/job-trends", adminController.getJobTrends);
router.get("dashboard/job-trends-24h",adminController.getJobTrends24h);

/* =====================
   USER MANAGEMENT
===================== */
router.get("/users", adminController.getUsers);
router.patch("/users/:id/status", adminController.updateUserStatus);

/* =====================
   JOB MODERATION
===================== */

// ⚠️ ROUTE CỤ THỂ PHẢI ĐẶT TRƯỚC
router.get(
  "/jobs/:id/logs",
  adminController.getJobModerationLogs
);

// danh sách job
router.get("/jobs", adminController.getJobs);

// chi tiết job (review)
router.get(
  "/jobs/:id",
  adminController.getJobDetailForAdmin
);

// duyệt
router.patch(
  "/jobs/:id/approve",
  adminController.approveJob
);

// từ chối
router.patch(
  "/jobs/:id/reject",
  adminController.rejectJob
);

/* =====================
   JOB CATEGORIES
===================== */
router.get("/categories", adminController.getCategories);
router.post("/categories", adminController.createCategory);
router.patch(
  "/categories/:id/toggle",
  adminController.toggleCategory
);

module.exports = router;
