const db = require("../config/db");

//DASHBOARD
exports.dashboard = async (req, res) => {
  try {
    const [[totalUsers]] = await db.execute(
      "SELECT COUNT(*) AS total FROM users"
    );

    const [[inactiveUsers]] = await db.execute(
      "SELECT COUNT(*) AS total FROM users WHERE status <> 'active'"
    );

    const [[pendingJobs]] = await db.execute(
      "SELECT COUNT(*) AS total FROM job WHERE status = 'pending'"
    );

    const [[approvedJobs]] = await db.execute(
      "SELECT COUNT(*) AS total FROM job WHERE status = 'approved'"
    );

    const [[rejectedJobs]] = await db.execute(
      "SELECT COUNT(*) AS total FROM job WHERE status = 'rejected'"
    );

    res.json({
      total_users: totalUsers.total,
      inactive_users: inactiveUsers.total,
      pending_jobs: pendingJobs.total,
      approved_jobs: approvedJobs.total,
      rejected_jobs: rejectedJobs.total,
    });
  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//JOB TRENDS (7 DAYS)
exports.getJobTrends = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        d.date,
        COALESCE(j.created, 0) AS created,
        COALESCE(j.approved, 0) AS approved
      FROM (
        SELECT CURDATE() - INTERVAL n DAY AS date
        FROM (
          SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION
          SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6
        ) days
      ) d
      LEFT JOIN (
        SELECT
          DATE(created_at) AS date,
          COUNT(*) AS created,
          SUM(status = 'approved') AS approved
        FROM job
        WHERE created_at >= CURDATE() - INTERVAL 6 DAY
        GROUP BY DATE(created_at)
      ) j ON d.date = j.date
      ORDER BY d.date
    `);

    res.json(rows);
  } catch (err) {
    console.error("JOB TRENDS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


//USERS MANAGEMENT
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


//JOB MODERATION
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
      JOIN employer e ON j.employer_id = e.id
      JOIN users u ON e.user_id = u.id
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


//APPROVE / REJECT JOB
exports.approveJob = async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

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

  res.json({ message: "Job approved" });
};

exports.rejectJob = async (req, res) => {
  const { id } = req.params;
  const { admin_note } = req.body;

  if (!admin_note || !admin_note.trim()) {
    return res.status(400).json({
      message: "Reject reason is required",
    });
  }

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

  res.json({ message: "Job rejected" });
};


//JOB DETAIL (ADMIN)
exports.getJobDetailForAdmin = async (req, res) => {
  const jobId = req.params.id;

  const [rows] = await db.execute(
    `
    SELECT
      j.*,
      e.company_name,
      e.website,
      CONCAT_WS(', ', e.address_detail, e.district, e.city) AS company_address
    FROM job j
    JOIN employer e ON j.employer_id = e.id
    WHERE j.id = ?
    `,
    [jobId]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Job not found" });
  }

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
    ...rows[0],
    skills,
  });
};


//CATEGORIES
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

// SKILLS MANAGEMENT
exports.getSkills = async (req, res) => {
  try {
    const { category_id, skill_type } = req.query;

    let sql = `
      SELECT
        s.id,
        s.name,
        s.skill_type,
        jc.name AS category_name,
        COUNT(DISTINCT js.job_id) AS job_count,
        COUNT(DISTINCT cs.candidate_id) AS candidate_count
      FROM skill s
      LEFT JOIN job_category jc ON s.category_id = jc.id
      LEFT JOIN job_skill js ON s.id = js.skill_id
      LEFT JOIN candidate_skill cs ON s.id = cs.skill_id
      WHERE 1 = 1
    `;

    const params = [];

    if (category_id) {
      sql += " AND s.category_id = ?";
      params.push(category_id);
    }

    if (skill_type) {
      sql += " AND s.skill_type = ?";
      params.push(skill_type);
    }

    sql += `
      GROUP BY s.id
      ORDER BY s.name
    `;

    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("GET SKILLS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.createSkill = async (req, res) => {
  const { name, category_id, skill_type } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Skill name is required" });
  }

  try {
    await db.execute(
      `
      INSERT INTO skill (name, category_id, skill_type)
      VALUES (?, ?, ?)
      `,
      [name, category_id || null, skill_type || "technical"]
    );

    res.json({ message: "Skill created" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Skill already exists" });
    }
    console.error("CREATE SKILL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateSkill = async (req, res) => {
  const { id } = req.params;
  const { name, category_id, skill_type } = req.body;

  try {
    const [result] = await db.execute(
      `
      UPDATE skill
      SET name = ?, category_id = ?, skill_type = ?
      WHERE id = ?
      `,
      [name, category_id || null, skill_type, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.json({ message: "Skill updated" });
  } catch (err) {
    console.error("UPDATE SKILL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.deleteSkill = async (req, res) => {
  const { id } = req.params;

  try {
    const [[usage]] = await db.execute(
      `
      SELECT
        (SELECT COUNT(*) FROM job_skill WHERE skill_id = ?) +
        (SELECT COUNT(*) FROM candidate_skill WHERE skill_id = ?) AS total_usage
      `,
      [id, id]
    );

    if (usage.total_usage > 0) {
      return res.status(400).json({
        message: "Skill is in use and cannot be deleted",
      });
    }

    await db.execute("DELETE FROM skill WHERE id = ?", [id]);
    res.json({ message: "Skill deleted" });
  } catch (err) {
    console.error("DELETE SKILL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// SKILL STATS
exports.getSkillStats = async (req, res) => {
  try {
    const [[total]] = await db.execute(
      "SELECT COUNT(*) AS total FROM skill"
    );

    const [[soft]] = await db.execute(
      "SELECT COUNT(*) AS total FROM skill WHERE skill_type = 'soft'"
    );

    const [[technical]] = await db.execute(
      "SELECT COUNT(*) AS total FROM skill WHERE skill_type = 'technical'"
    );

    res.json({
      total: total.total,
      soft: soft.total,
      technical: technical.total,
    });
  } catch (err) {
    console.error("SKILL STATS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};