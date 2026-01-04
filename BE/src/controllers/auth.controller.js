const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret_key_luan_van';


exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const [exists] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (exists.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, role]
    );

    const userId = result.insertId;

    if (role === 'employer') {
      await db.execute(
        `
        INSERT INTO employer (user_id, email, is_profile_completed)
        VALUES (?, ?, 0)
        `,
        [userId, email]
      );
    }

    res.status(201).json({ message: 'Register successful' });
  } catch (error) {
    console.error('REGISTER ERROR:', error);
    res.status(500).json({ message: 'Register failed' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* =====================
       1️⃣ VALIDATE INPUT
    ===================== */
    if (!email || !password) {
      return res.status(400).json({
        message: "Missing email or password",
      });
    }

    /* =====================
       2️⃣ FIND USER
    ===================== */
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
        message: "Invalid email or password",
      });
    }

    const user = rows[0];

    /* =====================
       3️⃣ CHECK STATUS (🔥 QUAN TRỌNG)
    ===================== */
    if (user.status !== "active") {
      return res.status(403).json({
        message: "Tài khoản đã bị khóa",
      });
    }

    /* =====================
       4️⃣ CHECK PASSWORD
    ===================== */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    /* =====================
       5️⃣ SIGN TOKEN
    ===================== */
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    /* =====================
       6️⃣ RESPONSE
    ===================== */
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Login failed",
    });
  }
};
