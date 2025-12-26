const express = require('express');
const router = express.Router();
const saveJobController = require('../controllers/saveJob.controller');

router.post('/',saveJobController.saveJob);
router.get('/:candidate_id', saveJobController.getSavedJobs);

module.exports = router;