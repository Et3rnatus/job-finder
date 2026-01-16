const express = require('express');
const router = express.Router();
const { verifyToken,requireRole } = require('../middlewares/auth.middleware');
const employerController = require('../controllers/employer.controller');
const uploadEmployerLogo = require("../middlewares/uploadEmployerLogo");

    router.put('/profile', verifyToken, employerController.updateProfile);
    
    // Kiểm tra hoàn thành hồ sơ
    router.get("/check-profile", verifyToken, requireRole("employer"), employerController.checkProfile);

    //Lấy hồ sơ nhà tuyển dụng
    router.get("/profile", verifyToken, requireRole("employer"), employerController.getProfile);

    // lấy công việc đã đăng của nhà tuyển dụng
    router.get("/jobs", verifyToken, requireRole("employer"), employerController.getMyJobs);


    router.get(
  "/applications/:applicationId",
  verifyToken,
  requireRole("employer"),
  employerController.getApplicationDetailForEmployer
);

router.patch(
  "/jobs/:id/resubmit",
  verifyToken,
  requireRole("employer"),
  employerController.resubmitJob
);

router.put(
  "/logo",
  verifyToken,
  requireEmployer,
  uploadEmployerLogo.single("logo"),
  employerController.updateEmployerLogo
);

module.exports = router;
