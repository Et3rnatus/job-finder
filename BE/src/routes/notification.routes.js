const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notification.controller");
const { verifyToken, requireRole } = require("../middlewares/auth.middleware");

/**
 Employer & Candidate xem danh sách thông báo
 */
router.get(
  "/me",
  verifyToken,
  requireRole(["employer", "candidate"]),
  notificationController.getMyNotifications
);

/**
 * Đánh dấu 1 thông báo đã đọc
 */
router.patch(
  "/:id/read",
  verifyToken,
  requireRole(["employer", "candidate"]),
  notificationController.markAsRead
);

/**
 * Đánh dấu TẤT CẢ thông báo đã đọc
 */
router.patch(
  "/read-all",
  verifyToken,
  requireRole(["employer", "candidate"]),
  notificationController.markAllAsRead
);

/**
 * XÓA TẤT CẢ THÔNG BÁO ĐÃ ĐỌC
 */
router.delete(
  "/read",
  verifyToken,
  requireRole(["employer", "candidate"]),
  notificationController.deleteReadNotifications
);

module.exports = router;
