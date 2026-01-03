const pool = require('../config/db');


 // API Lấy toàn bộ hồ sơ ứng viên
exports.getProfile = async (req, res) => {
  const candidate = req.candidate;

  try {
    // 🔹 lấy email từ users
    const [[user]] = await pool.query(
      'SELECT email FROM users WHERE id = ?',
      [candidate.user_id]
    );

    const [skills] = await pool.query(
      `SELECT s.id, s.name
       FROM skill s
       JOIN candidate_skill cs ON s.id = cs.skill_id
       WHERE cs.candidate_id = ?`,
      [candidate.id]
    );

    const [education] = await pool.query(
      `SELECT school, degree, major, start_date, end_date
       FROM education
       WHERE candidate_id = ?`,
      [candidate.id]
    );

    const [experiences] = await pool.query(
      `SELECT company, position, start_date, end_date, description
       FROM work_experience
       WHERE candidate_id = ?`,
      [candidate.id]
    );

    res.json({
      id: candidate.id,
      full_name: candidate.full_name,
      email: user?.email || null,
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
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: "Load profile failed" });
  }
};


// API check hồ sơ ứng viên
exports.checkProfile = async (req, res) => {
  const c = req.candidate;
  const missingFields = [];

  if (!c.full_name) missingFields.push("Họ tên");
  if (!c.contact_number) missingFields.push("Số điện thoại");
  if (!c.date_of_birth) missingFields.push("Ngày sinh");

  res.json({
    is_profile_completed: missingFields.length === 0,
    missing_fields: missingFields,
  });
};


 // Update toàn bộ hồ sơ + cập nhật trạng thái hoàn thiện
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
    /* ===== 1️⃣ VALIDATE BẮT BUỘC ===== */
    if (!full_name || !contact_number || !date_of_birth) {
      return res.status(400).json({
        message: "Họ tên, số điện thoại và ngày sinh là bắt buộc",
      });
    }

    const dob = new Date(date_of_birth);
    if (isNaN(dob.getTime())) {
      return res.status(400).json({
        message: "Ngày sinh không hợp lệ",
      });
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        message: "Vui lòng chọn ít nhất một kỹ năng",
      });
    }

    /* ===== 2️⃣ TRANSACTION ===== */
    await connection.beginTransaction();

    /* ===== 3️⃣ UPDATE CANDIDATE ===== */
    await connection.query(
      `
      UPDATE candidate
      SET
        full_name = ?,
        contact_number = ?,
        address = ?,
        bio = ?,
        gender = ?,
        date_of_birth = ?,
        is_profile_completed = 1
      WHERE id = ?
      `,
      [
        full_name.trim(),
        contact_number.trim(),
        address || null,
        bio || null,
        gender || null,
        date_of_birth,
        candidate.id
      ]
    );

    /* ===== 4️⃣ SKILLS ===== */
    await connection.query(
      "DELETE FROM candidate_skill WHERE candidate_id = ?",
      [candidate.id]
    );

    for (const skillId of skills) {
      await connection.query(
        "INSERT INTO candidate_skill (candidate_id, skill_id) VALUES (?, ?)",
        [candidate.id, skillId]
      );
    }

    /* ===== 5️⃣ EDUCATION ===== */
    await connection.query(
      "DELETE FROM education WHERE candidate_id = ?",
      [candidate.id]
    );

    if (Array.isArray(education)) {
      for (const edu of education) {
        if (!edu.school && !edu.degree && !edu.major) continue;

        await connection.query(
          `
          INSERT INTO education
          (candidate_id, school, degree, major, start_date, end_date)
          VALUES (?, ?, ?, ?, ?, ?)
          `,
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

    /* ===== 6️⃣ EXPERIENCE ===== */
    await connection.query(
      "DELETE FROM work_experience WHERE candidate_id = ?",
      [candidate.id]
    );

    if (Array.isArray(experiences)) {
      for (const exp of experiences) {
        if (!exp.company && !exp.position) continue;

        await connection.query(
          `
          INSERT INTO work_experience
          (candidate_id, company, position, start_date, end_date, description)
          VALUES (?, ?, ?, ?, ?, ?)
          `,
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

    res.json({
      message: "Cập nhật hồ sơ thành công",
      is_profile_completed: 1
    });
  } catch (error) {
    await connection.rollback();
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: "Update profile failed" });
  } finally {
    connection.release();
  }
};
