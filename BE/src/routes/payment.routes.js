const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");

router.post("/momo/create", paymentController.createMoMoPayment);
router.post("/momo-ipn", paymentController.momoIPN);
// Admin duyệt
router.post("/approve", paymentController.approvePayment);

// Admin xem danh sách
router.get("/admin", paymentController.getAllPayments);


module.exports = router;
