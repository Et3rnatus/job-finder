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

//bỏ lưu job
router.delete(
  '/:jobId',
  verifyToken,
  requireRole('candidate'),
  saveJobController.unsaveJob
);

router.get(
  "/check/:jobId",
  verifyToken,
  requireRole("candidate"),
  saveJobController.checkSavedJob
);


module.exports = router;
