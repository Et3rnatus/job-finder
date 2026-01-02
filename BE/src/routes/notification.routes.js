const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const notificationController = require("../controllers/notification.controller");

router.get("/", verifyToken, notificationController.getMyNotifications);
router.patch("/:id/read", verifyToken, notificationController.markAsRead);

module.exports = router;
