const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');

router.post('/',applicationController.applyJob);
router.get('/by-candidate/:candidate_id',applicationController.getByCandidate);
router.put('/:id/status',applicationController.updateStatus);

module.exports = router;