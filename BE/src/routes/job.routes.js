const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');

router.post('/', jobController.createJob);
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobDetail);

module.exports = router;