const db = require("../config/db");

module.exports = async (req, res, next) => {
  if (req.user.role !== "employer") return next();

  const [rows] = await db.execute(
    "SELECT status FROM users WHERE id = ?",
    [req.user.id]
  );

  if (rows.length === 0 || rows[0].status !== "active") {
    return res.status(403).json({
      message:
        "Vui lòng thanh toán gói dịch vụ để sử dụng chức năng này",
    });
  }

  next();
};
