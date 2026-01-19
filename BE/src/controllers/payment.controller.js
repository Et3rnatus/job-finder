/**
 * NOTE:
 * Module mô phỏng thanh toán VietQR cho mục đích học thuật (luận văn).
 * KHÔNG kết nối ngân hàng thật, KHÔNG phát sinh giao dịch tài chính.
 */

const db = require("../config/db");

/* =====================
   DEMO IN-MEMORY STORE
===================== */
// Lưu tạm giao dịch để demo (không dùng DB thật)
const demoPayments = {};

/* =====================
   PACKAGE CONFIG
===================== */
const PACKAGES = {
  basic: {
    name: "Gói Cơ Bản",
    price: 50000,
    postLimit: 3,
    durationDays: 30,
  },
  standard: {
    name: "Gói Tiêu Chuẩn",
    price: 150000,
    postLimit: 10,
    durationDays: 30,
  },
  premium: {
    name: "Gói Cao Cấp",
    price: 300000,
    postLimit: -1, // không giới hạn
    durationDays: 30,
  },
};

/* =====================
   CREATE VIETQR PAYMENT
===================== */
exports.createVietQRPayment = async (req, res) => {
  try {
    const { packageId } = req.body;
    const pkg = PACKAGES[packageId];

    if (!pkg) {
      return res.status(400).json({
        message: "Invalid package",
      });
    }

    const orderId = "VIETQR_" + Date.now();

    /* =====================
       TRANSFER INFO (REALISTIC)
    ===================== */
    // Nội dung chuyển tiền (chuẩn đối soát ngân hàng)
    const transferContent = `JOBFINDER ${packageId.toUpperCase()} U${req.user.id} ${orderId}`;

    // Tên người nhận (demo)
    const accountName = "CONG TY JOBFINDER (DEMO)";

    /* =====================
       SAVE PAYMENT (DEMO)
    ===================== */
    const payment = {
      orderId,
      userId: req.user.id,
      packageId,
      packageName: pkg.name,
      amount: pkg.price,
      postLimit: pkg.postLimit,
      durationDays: pkg.durationDays,
      transferContent,
      accountName,
      status: "PENDING",
      createdAt: new Date(),
    };

    demoPayments[orderId] = payment;

    /* =====================
       GENERATE SAFE VIETQR
       (STK GIẢ – KHÔNG TỒN TẠI)
    ===================== */
    const qrUrl =
      `https://img.vietqr.io/image/970422-0000000000-compact.png` +
      `?amount=${pkg.price}` +
      `&addInfo=${encodeURIComponent(transferContent)}` +
      `&accountName=${encodeURIComponent(accountName)}`;

    return res.json({
      message: "Tạo mã VietQR thành công",
      orderId,
      qrUrl,
      amount: pkg.price,
      transferContent,
      accountName,
      package: {
        id: packageId,
        name: pkg.name,
        durationDays: pkg.durationDays,
        postLimit: pkg.postLimit,
      },
    });
  } catch (error) {
    console.error("CREATE VIETQR PAYMENT ERROR:", error);
    return res.status(500).json({
      message: "Create VietQR payment failed",
    });
  }
};

/* =====================
   ADMIN: APPROVE PAYMENT
===================== */
exports.approvePayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const payment = demoPayments[orderId];

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    // ❌ Không cho duyệt lại
    if (payment.status === "SUCCESS") {
      return res.status(400).json({
        message: "Payment already approved",
      });
    }

    // 1️⃣ Update trạng thái payment
    payment.status = "SUCCESS";
    payment.approvedAt = new Date();
    payment.expiredAt = new Date(
      Date.now() + payment.durationDays * 86400000
    );

    // 2️⃣ MỞ QUYỀN EMPLOYER (DB THẬT)
    await db.execute(
      `UPDATE users
       SET status = 'active'
       WHERE id = ?`,
      [payment.userId]
    );

    console.log(
      "✅ EMPLOYER ACTIVATED:",
      payment.userId,
      "| PACKAGE:",
      payment.packageId,
      "| EXPIRED AT:",
      payment.expiredAt
    );

    return res.json({
      message:
        "Payment approved. Employer activated with time-limited access.",
      payment,
    });
  } catch (error) {
    console.error("APPROVE PAYMENT ERROR:", error);
    return res.status(500).json({
      message: "Approve payment failed",
    });
  }
};

/* =====================
   ADMIN: LIST PAYMENTS
===================== */
exports.getAllPayments = (req, res) => {
  return res.json(Object.values(demoPayments));
};
