const express = require("express");
const router = express.Router();

const {
  verifyToken,
  requireRole,
} = require("../middlewares/auth.middleware");

const adminController = require("../controllers/admin.controller");

/* =====================================
   ADMIN AUTH (GLOBAL)
===================================== */
router.use(verifyToken);
router.use(requireRole("admin"));

/* =====================================
   DASHBOARD
===================================== */

// GET /api/admin/dashboard
router.get("/dashboard", adminController.dashboard);

// GET /api/admin/dashboard/job-trends
router.get(
  "/dashboard/job-trends",
  adminController.getJobTrends
);

/* =====================================
   USER MANAGEMENT
===================================== */

// GET /api/admin/users
router.get("/users", adminController.getUsers);

// PATCH /api/admin/users/:id/status
router.patch(
  "/users/:id/status",
  adminController.updateUserStatus
);

/* =====================================
   JOB MODERATION
===================================== */

// GET /api/admin/jobs?status=pending
router.get("/jobs", adminController.getJobs);

// GET /api/admin/jobs/:id
router.get(
  "/jobs/:id",
  adminController.getJobDetailForAdmin
);

// PATCH /api/admin/jobs/:id/approve
router.patch(
  "/jobs/:id/approve",
  adminController.approveJob
);

// PATCH /api/admin/jobs/:id/reject
router.patch(
  "/jobs/:id/reject",
  adminController.rejectJob
);

/* =====================================
   JOB CATEGORIES
===================================== */

// GET /api/admin/categories
router.get(
  "/categories",
  adminController.getCategories
);

// POST /api/admin/categories
router.post(
  "/categories",
  adminController.createCategory
);

// PATCH /api/admin/categories/:id/toggle
router.patch(
  "/categories/:id/toggle",
  adminController.toggleCategory
);

router.get("/skills", adminController.getSkills);
router.post("/skills", adminController.createSkill);
router.put("/skills/:id", adminController.updateSkill);
router.delete("/skills/:id", adminController.deleteSkill);
router.get("/skills/stats", adminController.getSkillStats);

module.exports = router;
