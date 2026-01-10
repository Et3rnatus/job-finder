const https = require("https");
const crypto = require("crypto");
const momoConfig = require("../config/momo.config");

/* =====================
   DEMO IN-MEMORY STORE
===================== */
// Giả lập DB để demo luận văn
const demoPayments = {};

/* =====================
   CREATE MOMO PAYMENT
===================== */
exports.createMoMoPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        message: "Amount is required",
      });
    }

    const orderId = "ORDER_" + Date.now();
    const requestId = orderId;
    const orderInfo = "Thanh toan goi dich vu";
    const requestType = "captureWallet";
    const extraData = "";
    const amountStr = String(amount);

    /* ===== LƯU GIAO DỊCH (PENDING) ===== */
    demoPayments[orderId] = {
      orderId,
      amount: amountStr,
      status: "PENDING", // 👈 chờ admin duyệt
      createdAt: new Date(),
    };

    /* ===== SIGNATURE ===== */
    const rawSignature =
      "accessKey=" + momoConfig.accessKey +
      "&amount=" + amountStr +
      "&extraData=" + extraData +
      "&ipnUrl=" + momoConfig.ipnUrl +
      "&orderId=" + orderId +
      "&orderInfo=" + orderInfo +
      "&partnerCode=" + momoConfig.partnerCode +
      "&redirectUrl=" + momoConfig.redirectUrl +
      "&requestId=" + requestId +
      "&requestType=" + requestType;

    const signature = crypto
      .createHmac("sha256", momoConfig.secretKey)
      .update(rawSignature)
      .digest("hex");

    /* ===== REQUEST BODY ===== */
    const requestBody = JSON.stringify({
      partnerCode: momoConfig.partnerCode,
      accessKey: momoConfig.accessKey,
      requestId,
      amount: amountStr,
      orderId,
      orderInfo,
      redirectUrl: momoConfig.redirectUrl,
      ipnUrl: momoConfig.ipnUrl,
      extraData,
      requestType,
      signature,
      lang: "vi",
    });

    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    };

    const momoReq = https.request(options, (momoRes) => {
      let body = "";

      momoRes.on("data", (chunk) => {
        body += chunk;
      });

      momoRes.on("end", () => {
        const data = JSON.parse(body);

        return res.json({
          payUrl: data.payUrl,
          orderId, // dùng cho admin duyệt
        });
      });
    });

    momoReq.on("error", (error) => {
      console.error("MOMO REQUEST ERROR:", error);
      return res.status(500).json({
        message: "MoMo payment failed",
      });
    });

    momoReq.write(requestBody);
    momoReq.end();
  } catch (error) {
    console.error("CREATE MOMO PAYMENT ERROR:", error);
    return res.status(500).json({
      message: "Create MoMo payment failed",
    });
  }
};

/* =====================
   MOMO IPN (LOG ONLY)
===================== */
exports.momoIPN = async (req, res) => {
  try {
    console.log("🔔 MOMO IPN RECEIVED (LOG ONLY):", req.body);

    // ❌ KHÔNG auto duyệt
    // ❌ Chỉ dùng để ghi nhận / đối soát nếu cần

    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.error("MOMO IPN ERROR:", error);
    return res.status(200).json({ message: "OK" });
  }
};

/* =====================
   ADMIN: APPROVE PAYMENT
===================== */
exports.approvePayment = (req, res) => {
  const { orderId } = req.body;

  if (!orderId || !demoPayments[orderId]) {
    return res.status(404).json({
      message: "Payment not found",
    });
  }

  demoPayments[orderId].status = "SUCCESS";
  demoPayments[orderId].approvedAt = new Date();

  console.log("✅ ADMIN APPROVED PAYMENT:", orderId);

  return res.json({
    message: "Payment approved",
    payment: demoPayments[orderId],
  });
};

/* =====================
   ADMIN: LIST PAYMENTS
===================== */
exports.getAllPayments = (req, res) => {
  return res.json(Object.values(demoPayments));
};
