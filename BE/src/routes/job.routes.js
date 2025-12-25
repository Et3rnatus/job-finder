const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');

router.post('/jobs', jobController.createJob);
router.get('/jobs', jobController.getJobs);
router.get('/:id', jobController.getJobDetail);

module.exports = router;