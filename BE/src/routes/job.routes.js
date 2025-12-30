const express = require('express');
const router = express.Router();

const jobController = require('../controllers/job.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { requireCompletedEmployerProfile } = require('../middlewares/employerProfile.middleware');

// employer đăng job
router.post(
  '/',
  verifyToken,
  requireRole('employer'),
  requireCompletedEmployerProfile,
  jobController.createJob
);

// public: lấy tất cả job
router.get('/', jobController.getAllJobs);

// public: xem chi tiết job
router.get('/:id', jobController.getJobDetail);

module.exports = router;
