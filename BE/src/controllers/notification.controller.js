const db = require("../config/db");

exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      `
      SELECT
        id,
        type,
        title,
        message,
        related_id,
        is_read,
        created_at
      FROM notification
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);
    res.status(500).json({ message: "Get notifications failed" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await db.execute(
      `
      UPDATE notification
      SET is_read = 1
      WHERE id = ? AND user_id = ?
      `,
      [id, userId]
    );

    res.json({ message: "Marked as read" });
  } catch (error) {
    console.error("MARK AS READ ERROR:", error);
    res.status(500).json({ message: "Update failed" });
  }
};
