const jwt = require('jsonwebtoken');

const JWT_SECRET ='secret_key_luan_van';

/**
 * Middleware: verify JWT token
 * - Check Authorization header
 * - Decode token
 * - Inject req.user
 */
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: 'Authorization header missing'
    });
  }

  // Expect: Bearer <token>
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      message: 'Invalid authorization format'
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    /**
     * Chuẩn hoá user object
     * decoded nên chứa: { id, role, email }
     */
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Middleware: require specific role
 * @param {string} role
 */
exports.requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        message: 'Forbidden'
      });
    }

    next();
  };
};
