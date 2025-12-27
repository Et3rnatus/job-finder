const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/auth.middleware');
const candidateController = require('../controllers/candidate.controller');

router.get('/check-profile',verifyToken, candidateController.checkProfile);

module.exports = router;
