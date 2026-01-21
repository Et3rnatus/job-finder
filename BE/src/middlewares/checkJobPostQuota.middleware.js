const db = require("../config/db");

/* =====================
   CHECK JOB POST QUOTA
===================== */

exports.checkJobPostQuota = async (req, res, next) => {
  try {
    if (req.user.role !== "employer") {
      return next();
    }

    const [rows] = await db.execute(
      `
      SELECT
        is_premium,
        job_post_limit,
        job_post_used,
        payment_history
      FROM employer
      WHERE user_id = ?
      LIMIT 1
      `,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(403).json({
        message: "Employer not found",
      });
    }

    const employer = rows[0];

    if (
      !Array.isArray(employer.payment_history) ||
      employer.payment_history.length === 0
    ) {
      return res.status(403).json({
        message: "Vui lòng mua gói dịch vụ để đăng tin tuyển dụng",
        code: "NO_PACKAGE",
      });
    }

    const latestPackage =
      employer.payment_history[employer.payment_history.length - 1];

    const now = new Date();
    const expiredAt = new Date(latestPackage.expiredAt);

    if (expiredAt <= now) {
      return res.status(403).json({
        message: "Gói dịch vụ đã hết hạn",
        code: "PACKAGE_EXPIRED",
      });
    }

    if (employer.job_post_limit === -1) {
      return next();
    }

    if (employer.job_post_used >= employer.job_post_limit) {
      return res.status(403).json({
        message: "Bạn đã sử dụng hết số tin đăng của gói hiện tại",
        code: "POST_QUOTA_EXCEEDED",
      });
    }

    next();
  } catch (error) {
    console.error("CHECK JOB POST QUOTA ERROR:", error);
    return res.status(500).json({
      message: "Check job post quota failed",
    });
  }
};

