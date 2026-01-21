

const db = require("../config/db");
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
    postLimit: -1,
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

    const transferContent = `JOBFINDER ${packageId.toUpperCase()} U${req.user.id} ${orderId}`;

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
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status === "SUCCESS") {
      return res.status(400).json({ message: "Payment already approved" });
    }

    const now = new Date();

    /* =====================
       GET EMPLOYER
    ===================== */
    const [rows] = await db.execute(
      `
      SELECT 
        job_post_limit,
        job_post_used,
        payment_history
      FROM employer
      WHERE user_id = ?
      LIMIT 1
      `,
      [payment.userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Employer not found" });
    }

    const employer = rows[0];

    const history = Array.isArray(employer.payment_history)
      ? employer.payment_history
      : [];

    const lastPackage =
      history.length > 0 ? history[history.length - 1] : null;

    let newExpiredAt;
    let newJobPostLimit;
    let newJobPostUsed = employer.job_post_used || 0;

    /* =====================
       CỘNG DỒN / RESET
    ===================== */
    if (lastPackage && new Date(lastPackage.expiredAt) > now) {
      newExpiredAt = new Date(
        new Date(lastPackage.expiredAt).getTime() +
          payment.durationDays * 86400000
      );

      newJobPostLimit =
        (employer.job_post_limit || 0) + payment.postLimit;
    } else {
      newExpiredAt = new Date(
        now.getTime() + payment.durationDays * 86400000
      );

      newJobPostLimit = payment.postLimit;
      newJobPostUsed = 0;
    }

    /* =====================
    UPDATE PAYMENT (DEMO)
    ===================== */
    payment.status = "SUCCESS";
    payment.approvedAt = now;
    payment.expiredAt = newExpiredAt;

    /* =====================
       PUSH HISTORY
    ===================== */
    const paymentHistoryItem = {
      orderId: payment.orderId,
      packageId: payment.packageId,
      packageName: payment.packageName,
      amount: payment.amount,
      durationDays: payment.durationDays,
      postLimit: payment.postLimit,
      method: "VietQR",
      status: "SUCCESS",
      approvedAt: now,
      expiredAt: newExpiredAt,
    };

    history.push(paymentHistoryItem);

    /* =====================
       UPDATE EMPLOYER
    ===================== */
    await db.execute(
      `
      UPDATE employer
      SET 
        is_premium = 1,
        premium_activated_at = ?,
        job_post_limit = ?,
        job_post_used = ?,
        payment_history = ?
      WHERE user_id = ?
      `,
      [
        now,
        newJobPostLimit,
        newJobPostUsed,
        JSON.stringify(history),
        payment.userId,
      ]
    );

    return res.json({
      message: "Payment approved. Package quota updated successfully.",
      currentQuota: {
        job_post_limit: newJobPostLimit,
        job_post_used: newJobPostUsed,
        expiredAt: newExpiredAt,
      },
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
