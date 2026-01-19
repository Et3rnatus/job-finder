const express = require('express');
const router = express.Router();

const jobController = require('../controllers/job.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { requireCompletedEmployerProfile } = require('../middlewares/employerProfile.middleware');
const { checkEmployerPremium } = require("../middlewares/checkEmployerPremium.middleware");
const { checkJobPostQuota} = require("../middlewares/checkJobPostQuota.middleware");


// employer đăng job
router.post(
  '/',
  verifyToken,
  requireRole('employer'),
  requireCompletedEmployerProfile,
  checkEmployerPremium,
  checkJobPostQuota,
  jobController.createJob
);

router.get("/filter", jobController.filterJobs);

// employer đóng job ✅ (THÊM)
router.patch(
  '/:id/close',
  verifyToken,
  requireRole('employer'),
  jobController.closeJob
);

// lấy tất cả job (public)
router.get('/', jobController.getAllJobs);

// public: xem chi tiết job
router.get('/:id', jobController.getJobDetail);

router.patch(
  "/:id/reopen",
  verifyToken,
  requireRole("employer"),
  jobController.reopenJob
);


module.exports = router;
