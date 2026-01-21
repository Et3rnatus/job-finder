const jwt = require("jsonwebtoken");
const db = require("../config/db");

const JWT_SECRET = "secret_key_luan_van";

/* =========================
   VERIFY TOKEN + CHECK STATUS
========================= */
exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization header missing",
    });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      message: "Invalid authorization format",
    });
  }

  const token = parts[1];

  try {
    
    const decoded = jwt.verify(token, JWT_SECRET);

    
    const [rows] = await db.execute(
      `
      SELECT 
        id,
        email,
        role,
        status
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const user = rows[0];

    
    if (user.status !== "active") {
      return res.status(401).json({
        message: "Tài khoản đã bị khóa",
      });
    }

    
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("VERIFY TOKEN ERROR:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

/* =========================
   REQUIRE ROLE
========================= */
exports.requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const allowedRoles = Array.isArray(roles)
      ? roles
      : [roles];

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
};
