const db = require("../config/db");

/* =========================
   DASHBOARD
========================= */
exports.dashboard = async (req, res) => {
  try {
    const [[totalUsers]] = await db.execute(
      "SELECT COUNT(*) total FROM users"
    );

    const [[blockedUsers]] = await db.execute(
      "SELECT COUNT(*) total FROM users WHERE status = 'blocked'"
    );

    const [[pendingJobs]] = await db.execute(
      "SELECT COUNT(*) total FROM job WHERE status = 'pending'"
    );

    const [[approvedJobs]] = await db.execute(
      "SELECT COUNT(*) total FROM job WHERE status = 'approved'"
    );

    const [[rejectedJobs]] = await db.execute(
      "SELECT COUNT(*) total FROM job WHERE status = 'rejected'"
    );

    res.json({
      total_users: totalUsers.total,
      blocked_users: blockedUsers.total,
      pending_jobs: pendingJobs.total,
      approved_jobs: approvedJobs.total,
      rejected_jobs: rejectedJobs.total,
    });
  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/dashboard/trends
exports.dashboardTrends = async (req, res) => {
  try {
    const [created] = await db.execute(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total
      FROM job
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date
    `);

    const [approved] = await db.execute(`
      SELECT 
        DATE(approved_at) as date,
        COUNT(*) as total
      FROM job
      WHERE status = 'approved'
        AND approved_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(approved_at)
      ORDER BY date
    `);

    res.json({
      created,
      approved,
    });
  } catch (err) {
    console.error("DASHBOARD TRENDS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   USERS MANAGEMENT
========================= */

// GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT id, email, role, status
      FROM users
      ORDER BY id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/admin/users/:id/status
exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["active", "blocked"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const [[user]] = await db.execute(
      "SELECT role FROM users WHERE id = ?",
      [id]
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res
        .status(403)
        .json({ message: "Cannot change admin status" });
    }

    await db.execute(
      "UPDATE users SET status = ? WHERE id = ?",
      [status, id]
    );

    res.json({ message: "User status updated" });
  } catch (err) {
    console.error("UPDATE USER STATUS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   JOB MODERATION
========================= */

// GET /api/admin/jobs?status=pending
exports.getJobs = async (req, res) => {
  try {
    const { status } = req.query;

    let sql = `
      SELECT 
        j.id,
        j.title,
        j.status,
        j.created_at,
        j.employment_type,
        j.experience,
        j.hiring_quantity,
        u.email AS employer_email
      FROM job j
      LEFT JOIN employer e ON j.employer_id = e.id
      LEFT JOIN users u ON e.user_id = u.id
    `;

    const params = [];

    if (status) {
      sql += " WHERE j.status = ?";
      params.push(status);
    }

    sql += " ORDER BY j.created_at DESC";

    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("GET ADMIN JOBS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getJobTrends = async (req, res) => {
  const [rows] = await db.execute(`
    SELECT
      d.date,
      COALESCE(j.created, 0) AS created,
      COALESCE(a.approved, 0) AS approved
    FROM (
      SELECT CURDATE() - INTERVAL n DAY AS date
      FROM (
        SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION
        SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6
      ) days
    ) d
    LEFT JOIN (
      SELECT DATE(created_at) AS date, COUNT(*) AS created
      FROM job
      WHERE created_at >= CURDATE() - INTERVAL 6 DAY
      GROUP BY DATE(created_at)
    ) j ON d.date = j.date
    LEFT JOIN (
      SELECT DATE(created_at) AS date, COUNT(*) AS approved
      FROM job_moderation_log
      WHERE action = 'approved'
        AND created_at >= CURDATE() - INTERVAL 6 DAY
      GROUP BY DATE(created_at)
    ) a ON d.date = a.date
    ORDER BY d.date
  `);

  res.json(rows);
};

exports.getJobTrends24h = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        h.hour,
        COALESCE(j.created, 0) AS created,
        COALESCE(a.approved, 0) AS approved
      FROM (
        SELECT DATE_FORMAT(
          NOW() - INTERVAL n HOUR,
          '%Y-%m-%d %H:00:00'
        ) AS hour
        FROM (
          SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION
          SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION
          SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION
          SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION
          SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION
          SELECT 20 UNION SELECT 21 UNION SELECT 22 UNION SELECT 23
        ) hours
      ) h
      LEFT JOIN (
        SELECT
          DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00') AS hour,
          COUNT(*) AS created
        FROM job
        WHERE created_at >= NOW() - INTERVAL 24 HOUR
        GROUP BY hour
      ) j ON h.hour = j.hour
      LEFT JOIN (
        SELECT
          DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00') AS hour,
          COUNT(*) AS approved
        FROM job_moderation_log
        WHERE action = 'approved'
          AND created_at >= NOW() - INTERVAL 24 HOUR
        GROUP BY hour
      ) a ON h.hour = a.hour
      ORDER BY h.hour
    `);

    res.json(rows);
  } catch (err) {
    console.error("GET JOB TRENDS 24H ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// PATCH /api/admin/jobs/:id/approve
exports.approveJob = async (req, res) => {
  const { id } = req.params;

  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  try {
    const [result] = await db.execute(
      `
      UPDATE job
      SET status = 'approved',
          approved_by = ?,
          approved_at = NOW(),
          admin_note = NULL
      WHERE id = ? AND status = 'pending'
      `,
      [req.user.id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Job not found or already processed",
      });
    }

    // 🔑 LOG
    await db.execute(
      `
      INSERT INTO job_moderation_log (job_id, admin_id, action)
      VALUES (?, ?, 'approved')
      `,
      [id, req.user.id]
    );

    res.json({ message: "Job approved" });
  } catch (err) {
    console.error("APPROVE JOB ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/admin/jobs/:id/reject
exports.rejectJob = async (req, res) => {
  const { id } = req.params;
  const { admin_note } = req.body;

  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  if (!admin_note || !admin_note.trim()) {
    return res.status(400).json({
      message: "Reject reason is required",
    });
  }

  try {
    const [result] = await db.execute(
      `
      UPDATE job
      SET status = 'rejected',
          admin_note = ?,
          approved_by = ?,
          approved_at = NOW()
      WHERE id = ? AND status = 'pending'
      `,
      [admin_note, req.user.id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Job not found or already processed",
      });
    }

    // 🔑 LOG
    await db.execute(
      `
      INSERT INTO job_moderation_log (job_id, admin_id, action, note)
      VALUES (?, ?, 'rejected', ?)
      `,
      [id, req.user.id, admin_note]
    );

    res.json({ message: "Job rejected" });
  } catch (err) {
    console.error("REJECT JOB ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/jobs/:id/logs
exports.getJobModerationLogs = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(
      `
      SELECT 
        l.id,
        l.action,
        l.note,
        l.created_at,
        u.email AS admin_email
      FROM job_moderation_log l
      JOIN users u ON l.admin_id = u.id
      WHERE l.job_id = ?
      ORDER BY l.created_at DESC
      `,
      [id]
    );

    res.json(rows);
  } catch (err) {
    console.error("GET JOB LOGS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   JOB DETAIL FOR ADMIN
========================= */

// GET /api/admin/jobs/:id
exports.getJobDetailForAdmin = async (req, res) => {
  try {
    const jobId = req.params.id;

    const [rows] = await db.execute(
      `
      SELECT 
        j.id,
        j.title,
        j.description,
        j.job_requirements,
        j.benefits,
        j.min_salary,
        j.max_salary,
        j.is_salary_negotiable,
        j.hiring_quantity,
        j.location,
        j.employment_type,
        j.experience,
        j.level,
        j.education_level,
        j.expired_at,
        j.created_at,
        j.status,

        e.company_name,
        e.website,
        CONCAT_WS(', ',
          e.address_detail,
          e.district,
          e.city
        ) AS company_address,
        e.description AS company_description
      FROM job j
      JOIN employer e ON j.employer_id = e.id
      WHERE j.id = ?
      `,
      [jobId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    const job = rows[0];

    const [skills] = await db.execute(
      `
      SELECT s.id, s.name
      FROM job_skill js
      JOIN skill s ON js.skill_id = s.id
      WHERE js.job_id = ?
      `,
      [jobId]
    );

    res.json({
      ...job,
      skills,
    });
  } catch (err) {
    console.error("GET JOB DETAIL ADMIN ERROR:", err);
    res.status(500).json({ message: "Get job detail failed" });
  }
};

/* =========================
   CATEGORIES
========================= */

exports.getCategories = async (req, res) => {
  const [rows] = await db.execute(
    "SELECT id, name, is_active FROM job_category ORDER BY name"
  );
  res.json(rows);
};

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name required" });
  }

  await db.execute(
    "INSERT INTO job_category (name) VALUES (?)",
    [name]
  );
  res.json({ message: "Category created" });
};

exports.toggleCategory = async (req, res) => {
  const { id } = req.params;
  await db.execute(
    "UPDATE job_category SET is_active = NOT is_active WHERE id = ?",
    [id]
  );
  res.json({ message: "Updated" });
};
