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
      return res.status(400).json({ message: 'Email already exists' });
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
        id,
        email,
        password,
        role,
        status
      FROM users
      WHERE email = ?
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
      },
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return res.status(500).json({
      message: 'Login failed',
    });
  }
};
