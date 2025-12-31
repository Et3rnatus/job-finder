const db = require('../config/db');

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

    // 1️⃣ validate tối thiểu (BẮT BUỘC)
    if (!company_name || !city || !district || !address_detail) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin bắt buộc"
      });
    }

    // 2️⃣ ghép địa chỉ đầy đủ
    const fullAddress = `${address_detail}, ${district}, ${city}`;

    // 3️⃣ xác định trạng thái hoàn thiện hồ sơ
    // ❗ description KHÔNG bắt buộc
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
