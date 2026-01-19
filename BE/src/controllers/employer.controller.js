const db = require("../config/db");

/* =========================
   UPDATE EMPLOYER PROFILE
========================= */
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
      logo,
    } = req.body;

    if (
      !company_name ||
      !city ||
      !district ||
      !address_detail ||
      !business_license
    ) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin bắt buộc",
      });
    }

    /* =========================
       CHECK EXISTING LICENSE
    ========================= */
    const [[existing]] = await db.execute(
      `
      SELECT business_license
      FROM employer
      WHERE user_id = ?
      `,
      [userId]
    );

    // Nếu đã có license rồi → không cho sửa
    if (existing?.business_license) {
      return res.status(400).json({
        message: "Giấy phép kinh doanh chỉ được nhập một lần và không thể chỉnh sửa",
      });
    }

    const fullAddress = `${address_detail}, ${district}, ${city}`;

    try {
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
          is_profile_completed = 1
        WHERE user_id = ?
        `,
        [
          company_name.trim(),
          description || null,
          website || null,
          city,
          district,
          address_detail,
          business_license.trim(),
          fullAddress,
          logo || null,
          userId,
        ]
      );
    } catch (err) {
      // Bắt lỗi UNIQUE từ MySQL
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          message: "Giấy phép kinh doanh đã tồn tại trong hệ thống",
        });
      }
      throw err;
    }

    return res.json({
      message: "Employer profile completed",
      completed: true,
    });
  } catch (error) {
    console.error("UPDATE EMPLOYER PROFILE ERROR:", error);
    return res.status(500).json({
      message: "Update employer profile failed",
    });
  }
};

/* =========================
   CHECK EMPLOYER PROFILE
========================= */
exports.checkProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [[row]] = await db.execute(
      "SELECT is_profile_completed FROM employer WHERE user_id = ?",
      [userId]
    );

    return res.json({
      completed: row?.is_profile_completed === 1,
    });
  } catch (error) {
    return res.status(500).json({ message: "Check profile failed" });
  }
};

/* =========================
   GET EMPLOYER PROFILE
========================= */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      `
      SELECT
        company_name,
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

    return res.json(rows[0]);
  } catch (error) {
    console.error("GET EMPLOYER PROFILE ERROR:", error);
    return res.status(500).json({
      message: "Get employer profile failed",
    });
  }
};

/* =========================
   GET JOBS OF EMPLOYER
========================= */
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
        j.status,

        COUNT(a.id) AS total_applications,
        SUM(CASE WHEN a.status = 'pending' THEN 1 ELSE 0 END) AS pending_count,
        SUM(CASE WHEN a.status = 'approved' THEN 1 ELSE 0 END) AS approved_count,
        SUM(CASE WHEN a.status = 'rejected' THEN 1 ELSE 0 END) AS rejected_count

      FROM job j
      JOIN employer e ON e.id = j.employer_id
      LEFT JOIN application a ON a.job_id = j.id
      WHERE e.user_id = ?
      GROUP BY j.id
      ORDER BY j.created_at DESC
      `,
      [userId]
    );

    return res.json(rows);
  } catch (error) {
    console.error("GET EMPLOYER JOBS ERROR:", error);
    return res.status(500).json({
      message: "Get employer jobs failed",
    });
  }
};

/* =========================
   GET APPLICATION DETAIL (EMPLOYER)
========================= */
exports.getApplicationDetailForEmployer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { applicationId } = req.params;

    const [[row]] = await db.execute(
      `
      SELECT
        a.id,
        a.status,
        a.applied_at,
        a.cover_letter,
        a.snapshot_cv_json,
        j.title
      FROM application a
      JOIN job j ON a.job_id = j.id
      JOIN employer e ON j.employer_id = e.id
      WHERE a.id = ? AND e.user_id = ?
      `,
      [applicationId, userId]
    );

    if (!row) {
      return res.status(404).json({ message: "Application not found" });
    }

    const snapshot = row.snapshot_cv_json
      ? JSON.parse(row.snapshot_cv_json)
      : {};

    return res.json({
      application: {
        id: row.id,
        status: row.status,
        applied_at: row.applied_at,
        cover_letter: row.cover_letter,
        job_title: row.title,
      },
      snapshot,
    });
  } catch (err) {
    console.error("GET APPLICATION DETAIL ERROR:", err);
    return res.status(500).json({ message: "Failed to load application detail" });
  }
};

/* =========================
   RESUBMIT JOB
========================= */
exports.resubmitJob = async (req, res) => {
  const { id } = req.params;
  const employerUserId = req.user.id;

  try {
    const [[job]] = await db.execute(
      `
      SELECT j.id
      FROM job j
      JOIN employer e ON j.employer_id = e.id
      WHERE j.id = ?
        AND e.user_id = ?
        AND j.status = 'rejected'
      `,
      [id, employerUserId]
    );

    if (!job) {
      return res.status(400).json({
        message: "Job not found or cannot resubmit",
      });
    }

    await db.execute(
      `
      UPDATE job
      SET status = 'pending',
          admin_note = NULL
      WHERE id = ?
      `,
      [id]
    );

    return res.json({ message: "Job resubmitted successfully" });
  } catch (err) {
    console.error("RESUBMIT JOB ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateEmployerLogo = async (req, res) => {
  try {
    const user = req.user; // 👈 dùng user từ authMiddleware

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng chọn ảnh" });
    }

    const logoPath = `/uploads/employers/${req.file.filename}`;

    await db.execute(
  "UPDATE employer SET logo = ? WHERE user_id = ?",
  [logoPath, req.user.id]
);


    res.json({
      message: "Cập nhật logo công ty thành công",
      logo: logoPath,
    });
  } catch (error) {
    console.error("UPDATE EMPLOYER LOGO ERROR:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

/* =====================
   GET PAYMENT HISTORY
===================== */
exports.getPaymentHistory = async (req, res) => {
  try {
    // req.user.id lấy từ JWT middleware
    const userId = req.user.id;

    const [rows] = await db.execute(
      `
      SELECT payment_history
      FROM employer
      WHERE user_id = ?
      LIMIT 1
      `,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Employer not found",
      });
    }

    return res.json({
      history: rows[0].payment_history || [],
    });
  } catch (error) {
    console.error("GET PAYMENT HISTORY ERROR:", error);
    return res.status(500).json({
      message: "Get payment history failed",
    });
  }
};