const pool = require('../config/db');

exports.checkProfile = async (req, res) => {
  const userId = req.user.userId;

  try {
    const [[candidate]] = await pool.query(
      'SELECT id, full_name, contact_number, address FROM candidate WHERE user_id = ?',
      [userId]
    );

    if (!candidate) {
      return res.json({ completed: false });
    }

    // Hàm check rỗng an toàn
    const isEmpty = (value) => {
      return !value || value.trim() === '';
    };

    if (
      isEmpty(candidate.full_name) ||
      isEmpty(candidate.contact_number) ||
      isEmpty(candidate.address)
    ) {
      return res.json({ completed: false });
    }

    // Check có ít nhất 1 skill
    const [skills] = await pool.query(
      'SELECT id FROM candidate_skill WHERE candidate_id = ?',
      [candidate.id]
    );

    if (skills.length === 0) {
      return res.json({ completed: false });
    }

    res.json({ completed: true });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getProfile = async (req, res) => {
  const userId = req.user.userId;

  try {
    const [[candidate]] = await pool.query(
      `SELECT 
        id,
        full_name,
        contact_number,
        address,
        bio,
        gender,
        DATE_FORMAT(date_of_birth, '%Y-%m-%d') AS date_of_birth
       FROM candidate
       WHERE user_id = ?`,
      [userId]
    );

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Skills
    const [skills] = await pool.query(
      `SELECT s.id, s.name 
       FROM skill s
       JOIN candidate_skill cs ON s.id = cs.skill_id
       WHERE cs.candidate_id = ?`,
      [candidate.id]
    );

    // Education
    const [education] = await pool.query(
      `SELECT 
        school,
        degree,
        major,
        start_date,
        end_date
       FROM education
       WHERE candidate_id = ?`,
      [candidate.id]
    );

    // Work experience
    const [experiences] = await pool.query(
      `SELECT
        company,
        position,
        start_date,
        end_date,
        description
       FROM work_experience
       WHERE candidate_id = ?`,
      [candidate.id]
    );

    res.json({
      id: candidate.id,
      full_name: candidate.full_name,
      contact_number: candidate.contact_number,
      address: candidate.address,
      bio: candidate.bio,
      gender: candidate.gender,
      date_of_birth: candidate.date_of_birth,
      skills,
      education,
      experiences
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.user.userId;
  const {
    full_name,
    contact_number,
    address,
    bio,
    gender,
    date_of_birth,
    skills,
    education,
    experiences
  } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [[candidate]] = await connection.query(
      'SELECT id FROM candidate WHERE user_id = ?',
      [userId]
    );

    if (!candidate) {
      await connection.rollback();
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // 1️⃣ Update candidate
    await connection.query(
      `UPDATE candidate
       SET full_name=?, contact_number=?, address=?, bio=?, gender=?, date_of_birth=?
       WHERE id=?`,
      [
        full_name,
        contact_number,
        address,
        bio,
        gender,
        date_of_birth,
        candidate.id
      ]
    );

    // 2️⃣ Update skills
    await connection.query(
      'DELETE FROM candidate_skill WHERE candidate_id=?',
      [candidate.id]
    );

    if (Array.isArray(skills)) {
      for (const skillId of skills) {
        await connection.query(
          'INSERT INTO candidate_skill (candidate_id, skill_id) VALUES (?, ?)',
          [candidate.id, skillId]
        );
      }
    }

    // 3️⃣ Update education (OPTIONAL)
    await connection.query(
      'DELETE FROM education WHERE candidate_id=?',
      [candidate.id]
    );

    if (Array.isArray(education)) {
      for (const edu of education) {
        if (!edu.school && !edu.degree && !edu.major) continue;

        await connection.query(
          `INSERT INTO education
           (candidate_id, school, degree, major, start_date, end_date)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            candidate.id,
            edu.school || null,
            edu.degree || null,
            edu.major || null,
            edu.start_date || null,
            edu.end_date || null
          ]
        );
      }
    }

    // 4️⃣ Update work experience (OPTIONAL)
    await connection.query(
      'DELETE FROM work_experience WHERE candidate_id=?',
      [candidate.id]
    );

    if (Array.isArray(experiences)) {
      for (const exp of experiences) {
        if (!exp.company && !exp.position) continue;

        await connection.query(
          `INSERT INTO work_experience
           (candidate_id, company, position, start_date, end_date, description)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            candidate.id,
            exp.company || null,
            exp.position || null,
            exp.start_date || null,
            exp.end_date || null,
            exp.description || null
          ]
        );
      }
    }

    await connection.commit();
    res.json({ message: 'Profile updated successfully' });

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};
