const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notification.controller");
const { verifyToken, requireRole } = require("../middlewares/auth.middleware");


router.get(
  "/me",
  verifyToken,
  requireRole("employer"),
  notificationController.getMyNotifications
);


router.patch(
  "/:id/read",
  verifyToken,
  requireRole("employer"),
  notificationController.markAsRead
);

module.exports = router;
