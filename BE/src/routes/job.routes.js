const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const {verifyToken} = require('../middlewares/auth.middleware');

// EMPLOYER đăng tuyển (CẦN LOGIN)
router.post('/', verifyToken, jobController.createJob);

// PUBLIC
router.get('/', jobController.getJobs);
router.get('/search', jobController.searchJobs);
router.get('/:id', jobController.getJobDetail);

module.exports = router;
