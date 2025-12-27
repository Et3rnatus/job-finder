const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const employerController = require('../controllers/employer.controller');

// Profile
router.get('/profile', verifyToken, employerController.getProfile);
router.put('/profile', verifyToken, employerController.updateProfile);

// Jobs by employer
router.get('/jobs', verifyToken, employerController.getMyJobs);

// Applications
router.get('/applications/:jobId', verifyToken, employerController.getApplicationsByJob);

module.exports = router;
