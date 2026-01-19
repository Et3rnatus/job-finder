const db = require("../config/db");

/* =====================
   CHECK JOB POST QUOTA
===================== */
exports.checkJobPostQuota = async (req, res, next) => {
  try {
    // Chỉ áp dụng cho employer
    if (req.user.role !== "employer") {
      return next();
    }

    const [rows] = await db.execute(
      `
      SELECT
        is_premium,
        job_post_limit,
        job_post_used
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

    const {
      is_premium,
      job_post_limit,
      job_post_used,
    } = rows[0];

    // ❌ Chưa mua gói
    if (!is_premium) {
      return res.status(403).json({
        message: "Vui lòng mua gói dịch vụ để đăng tin tuyển dụng",
      });
    }

    // ♾️ Gói không giới hạn
    if (job_post_limit === -1) {
      return next();
    }

    // ❌ Hết lượt đăng
    if (job_post_used >= job_post_limit) {
      return res.status(403).json({
        message: "Bạn đã sử dụng hết số tin đăng của gói hiện tại",
      });
    }

    // ✅ Còn lượt
    next();
  } catch (error) {
    console.error("CHECK JOB POST QUOTA ERROR:", error);
    return res.status(500).json({
      message: "Check job post quota failed",
    });
  }
};
