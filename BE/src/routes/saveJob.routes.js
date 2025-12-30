const express = require('express');
const router = express.Router();

const saveJobController = require('../controllers/saveJob.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

// candidate xem job đã lưu
router.get(
  '/',
  verifyToken,
  requireRole('candidate'),
  saveJobController.getSavedJobs
);

// candidate lưu job
router.post(
  '/',
  verifyToken,
  requireRole('candidate'),
  saveJobController.saveJob
);

module.exports = router;
