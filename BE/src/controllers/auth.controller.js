const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {v4: uuidv4} = require('uuid');

exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (email, password, role) VALUES (?,?,?)',
      [email, hashedPassword, role]
    );
    const userId = result.insertId;

    if (role === 'candidate') {
      await pool.query(
        'INSERT INTO candidate (user_id, email, full_name) VALUES (?,?,?)',
        [userId, email, '']
      );
    }

    if (role === 'employer') {
      await pool.query(
        'INSERT INTO employer (user_id, email, company_name) VALUES (?,?,?)',
        [userId, email, '']
      );
    }

    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
    const {email,password}=req.body;

    try{
        const [rows]=await pool.query(
            'SELECT * FROM users WHERE email=?',
            [email]
        );
        if(rows.length===0){
            return  res.status(400).json({error:'Invalid email or password'});
        }
        const user=rows[0];
        const isPasswordValid=await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            return res.status(400).json({error:'Invalid password'});
        }

        const token=jwt.sign(
            {userId:user.id,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        );
        res.json({ token, role: user.role } );
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};  

