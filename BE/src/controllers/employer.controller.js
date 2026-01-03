const db = require('../config/db');

//cập nhật hồ sơ nhà tuyển dụng
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      company_name,
      description,
      website,
      city,
      district,
      address_detail,
      business_license,
      logo
    } = req.body;
    if (!company_name || !city || !district || !address_detail) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin bắt buộc"
      });
    }

    const fullAddress = `${address_detail}, ${district}, ${city}`;

    const isProfileCompleted =
      company_name &&
      city &&
      district &&
      address_detail &&
      business_license
        ? 1
        : 0;

    // 4️⃣ update DB
    await db.execute(
      `
      UPDATE employer
      SET
        company_name = ?,
        description = ?,
        website = ?,
        city = ?,
        district = ?,
        address_detail = ?,
        business_license = ?,
        address = ?,
        logo = ?,
        is_profile_completed = ?
      WHERE user_id = ?
      `,
      [
        company_name,
        description || null,
        website || null,
        city,
        district,
        address_detail,
        business_license || null,
        fullAddress,
        logo || null,
        isProfileCompleted,
        userId
      ]
    );

    res.json({
      message: isProfileCompleted
        ? "Employer profile completed"
        : "Employer profile updated but not completed",
      completed: !!isProfileCompleted
    });

  } catch (error) {
    console.error("UPDATE EMPLOYER PROFILE ERROR:", error);
    res.status(500).json({
      message: "Update employer profile failed"
    });
  }
};



//kiem tra profile employer da hoan thanh chua
exports.checkProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      "SELECT is_profile_completed FROM employer WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.json({ completed: false });
    }

    res.json({
      completed: rows[0].is_profile_completed === 1
    });
  } catch (error) {
    res.status(500).json({ message: "Check profile failed" });
  }
};

//lay thong tin profile employer
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      `
      SELECT
        company_name,
        email,
        logo,
        description,
        website,
        city,
        district,
        address_detail,
        business_license,
        is_profile_completed
      FROM employer
      WHERE user_id = ?
      `,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Employer profile not found",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("GET EMPLOYER PROFILE ERROR:", error);
    res.status(500).json({
      message: "Get employer profile failed",
    });
  }
};

//lấy những công việc đã đăng tuyển
exports.getMyJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      `
      SELECT 
        j.id,
        j.title,
        j.created_at,
        j.expired_at,
        j.status,                -- 👈 BẮT BUỘC PHẢI CÓ

        SUM(a.status != 'cancelled') AS total_applications,
        SUM(a.status = 'pending') AS pending_count,
        SUM(a.status = 'approved') AS approved_count,
        SUM(a.status = 'rejected') AS rejected_count

      FROM job j
      JOIN employer e ON e.id = j.employer_id
      LEFT JOIN application a ON a.job_id = j.id
      WHERE e.user_id = ?
      GROUP BY j.id
      ORDER BY j.created_at DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error("GET EMPLOYER JOBS ERROR:", error);
    res.status(500).json({
      message: "Get employer jobs failed",
    });
  }
};

exports.getApplicationDetailForEmployer = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // 1️⃣ application + snapshot
    const [[row]] = await db.execute(
      `
      SELECT
        a.id,
        a.status,
        a.applied_at,
        a.cover_letter,
        s.id AS snapshot_id,
        s.full_name,
        s.email,
        s.phone
      FROM application a
      JOIN application_snapshot s
        ON s.application_id = a.id
      WHERE a.id = ?
      `,
      [applicationId]
    );

    if (!row) {
      return res.status(404).json({ message: "Application not found" });
    }

    const snapshotId = row.snapshot_id;

    // 2️⃣ snapshot details
    const [skills] = await db.execute(
      `
      SELECT skill_name
      FROM application_snapshot_skill
      WHERE application_snapshot_id = ?
      `,
      [snapshotId]
    );

    const [experiences] = await db.execute(
      `
      SELECT company, position, start_date, end_date, description
      FROM application_snapshot_experience
      WHERE application_snapshot_id = ?
      `,
      [snapshotId]
    );

    const [educations] = await db.execute(
      `
      SELECT school, degree, major, start_date, end_date
      FROM application_snapshot_education
      WHERE application_snapshot_id = ?
      `,
      [snapshotId]
    );

    return res.json({
      application: {
        id: row.id,
        status: row.status,
        applied_at: row.applied_at,
        cover_letter: row.cover_letter,
      },
      profile: {
        full_name: row.full_name,
        email: row.email,
        phone: row.phone,
      },
      skills: skills.map(s => ({ name: s.skill_name })),
      experiences,
      educations,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to load application detail" });
  }
};
