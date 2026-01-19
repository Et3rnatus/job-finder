const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post(
  "/vietqr",
  verifyToken,
  paymentController.createVietQRPayment
);

router.post(
  "/approve",
  verifyToken,
  paymentController.approvePayment
);

router.get(
  "/admin",
  verifyToken,
  paymentController.getAllPayments
);

module.exports = router;
