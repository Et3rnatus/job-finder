const db = require("../config/db");

exports.checkEmployerPremium = async (req, res, next) => {
  try {
    // Không phải employer thì bỏ qua
    if (req.user.role !== "employer") return next();

    const [rows] = await db.execute(
      `
      SELECT 
        e.is_premium
      FROM employer e
      WHERE e.user_id = ?
      `,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(403).json({
        message: "Employer profile not found",
      });
    }

    if (rows[0].is_premium !== 1) {
      return res.status(403).json({
        message:
          "Vui lòng thanh toán gói dịch vụ để đăng tin tuyển dụng",
      });
    }

    next();
  } catch (error) {
    console.error("CHECK EMPLOYER PREMIUM ERROR:", error);
    return res.status(500).json({
      message: "Employer permission check failed",
    });
  }
};
