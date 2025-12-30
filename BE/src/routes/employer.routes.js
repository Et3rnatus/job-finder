    const express = require('express');
    const router = express.Router();
    const { verifyToken,requireRole } = require('../middlewares/auth.middleware');
    const employerController = require('../controllers/employer.controller');

    // Profile
    router.put('/profile', verifyToken, employerController.updateProfile);
    
    // Check profile completion
    router.get("/check-profile", verifyToken, requireRole("employer"), employerController.checkProfile);

    //Get employer profile information
    router.get("/profile", verifyToken, requireRole("employer"), employerController.getProfile);

    module.exports = router;
