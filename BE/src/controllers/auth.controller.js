const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret_key_luan_van';


exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1. validate
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // 2. kiểm tra email tồn tại
    const [exists] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (exists.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // 3. hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. tạo user
    const [result] = await db.execute(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, role]
    );

    const userId = result.insertId;

    // 5. nếu là employer → tạo hồ sơ employer (chưa hoàn thiện)
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

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password' });
    }

    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
};
