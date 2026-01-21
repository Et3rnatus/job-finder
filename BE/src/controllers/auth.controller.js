const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret_key_luan_van';

/* =====================
   REGISTER
===================== */
exports.register = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const normalizedRole = role.toLowerCase();

    if (!['admin', 'candidate', 'employer'].includes(normalizedRole)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    await connection.beginTransaction();

    const [exists] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (exists.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await connection.execute(
      `
      INSERT INTO users (email, password, role, status)
      VALUES (?, ?, ?, 'active')
      `,
      [email, hashedPassword, normalizedRole]
    );

    const userId = result.insertId;

    if (normalizedRole === 'employer') {
      await connection.execute(
        `
        INSERT INTO employer (user_id, email, is_profile_completed)
        VALUES (?, ?, 0)
        `,
        [userId, email]
      );
    }

    if (normalizedRole === 'candidate') {
      await connection.execute(
        `
        INSERT INTO candidate (user_id, email, is_profile_completed)
        VALUES (?, ?, 0)
        `,
        [userId, email]
      );
    }

    await connection.commit();

    return res.status(201).json({
      message: 'Register successful',
      user_id: userId,
      role: normalizedRole,
    });
  } catch (error) {
    await connection.rollback();
    console.error('REGISTER ERROR:', error);
    return res.status(500).json({ message: 'Register failed' });
  } finally {
    connection.release();
  }
};

/* =====================
   LOGIN
===================== */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Missing email or password',
      });
    }

    const [rows] = await db.execute(
      `
      SELECT 
        u.id,
        u.email,
        u.password,
        u.role,
        u.status,
        e.is_premium
      FROM users u
      LEFT JOIN employer e ON e.user_id = u.id
      WHERE u.email = ?
      LIMIT 1
      `,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const user = rows[0];

    if (user.status !== 'active') {
      return res.status(403).json({
        message: 'Account is inactive',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        is_premium: user.role === 'employer' ? user.is_premium ?? 0 : null,
      },
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return res.status(500).json({
      message: 'Login failed',
    });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Password confirmation does not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const [rows] = await db.execute(
      'SELECT password FROM users WHERE id = ? LIMIT 1',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    return res.json({ message: 'Change password successful' });
  } catch (error) {
    console.error('CHANGE PASSWORD ERROR:', error);
    return res.status(500).json({ message: 'Change password failed' });
  }
};
/* =====================
   FORGOT PASSWORD
===================== */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const [rows] = await db.execute(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    
    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Nếu email tồn tại, liên kết đặt lại mật khẩu sẽ được gửi',
      });
    }

    const userId = rows[0].id;

    const resetToken = jwt.sign(
      { userId, purpose: 'reset_password' },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const transporter = require('../config/mailer');

    await transporter.sendMail({
      from: '"JobFinder" <no-reply@jobfinder.com>',
      to: email,
      subject: 'Đặt lại mật khẩu',
      html: `
        <p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
        <p>Link có hiệu lực trong 15 phút:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    return res.status(200).json({
      success: true,
      message: 'Nếu email tồn tại, liên kết đặt lại mật khẩu sẽ được gửi',
    });

  } catch (error) {
    console.error('FORGOT PASSWORD ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Request failed',
    });
  }
};



/* =====================
   RESET PASSWORD
===================== */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu token hoặc mật khẩu mới',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn',
      });
    }

    if (decoded.purpose !== 'reset_password') {
      return res.status(400).json({
        success: false,
        message: 'Token không hợp lệ',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, decoded.userId]
    );

    return res.status(200).json({
      success: true,
      message: 'Đặt lại mật khẩu thành công',
    });
  } catch (error) {
    console.error('RESET PASSWORD ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Reset password failed',
    });
  }
};
