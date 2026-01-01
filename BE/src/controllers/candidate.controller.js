const pool = require('../config/db');

/**
 * GET /candidate/profile
 * Lấy toàn bộ hồ sơ candidate
 */
exports.getProfile = async (req, res) => {
  const candidate = req.candidate;

  try {
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
      `SELECT school, degree, major, start_date, end_date
       FROM education
       WHERE candidate_id = ?`,
      [candidate.id]
    );

    // Work experience
    const [experiences] = await pool.query(
      `SELECT company, position, start_date, end_date, description
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
      is_profile_completed: candidate.is_profile_completed,
      skills,
      education,
      experiences
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /candidate/check-profile
 * FE chỉ dùng để check trạng thái
 */
exports.checkProfile = async (req, res) => {
  res.json({
    is_profile_completed: req.candidate.is_profile_completed
  });
};

/**
 * PUT /candidate/profile
 * Update toàn bộ hồ sơ + quyết định hoàn thiện
 */
exports.updateProfile = async (req, res) => {
  const candidate = req.candidate;
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

    // 1️⃣ Update candidate info
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

    // 3️⃣ Update education
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

    // 4️⃣ Update work experience
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

    // 5️⃣ Quyết định hồ sơ đã hoàn thiện hay chưa (CHỐT NGHIỆP VỤ)
    const isCompleted =
      full_name &&
      contact_number &&
      address &&
      Array.isArray(skills) &&
      skills.length > 0
        ? 1
        : 0;

    await connection.query(
      'UPDATE candidate SET is_profile_completed=? WHERE id=?',
      [isCompleted, candidate.id]
    );

    await connection.commit();

    res.json({
      message: 'Profile updated successfully',
      is_profile_completed: isCompleted
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};
