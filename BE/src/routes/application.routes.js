const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const {verifyToken} = require('../middlewares/auth.middleware');


router.post('/',verifyToken,applicationController.applyJob);
router.get('/by-candidate/:candidate_id',verifyToken,applicationController.getByCandidate);
router.put('/:id/status',applicationController.updateStatus);

module.exports = router;