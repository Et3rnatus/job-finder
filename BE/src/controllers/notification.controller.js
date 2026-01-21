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
      LIMIT 50
      `,
      [userId]
    );

    return res.json(rows);
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);
    return res.status(500).json({ message: "Get notifications failed" });
  }
};


exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [result] = await db.execute(
      `
      UPDATE notification
      SET is_read = 1
      WHERE id = ? AND user_id = ?
      `,
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    return res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("MARK AS READ ERROR:", error);
    return res.status(500).json({ message: "Update failed" });
  }
};


exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const [[row]] = await db.execute(
      `
      SELECT COUNT(*) AS unread
      FROM notification
      WHERE user_id = ? AND is_read = 0
      `,
      [userId]
    );

    return res.json({ unread: row.unread });
  } catch (error) {
    console.error("GET UNREAD COUNT ERROR:", error);
    return res.status(500).json({ message: "Failed to get unread count" });
  }
};


exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.execute(
      `
      UPDATE notification
      SET is_read = 1
      WHERE user_id = ?
      `,
      [userId]
    );

    return res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("READ ALL ERROR:", error);
    return res.status(500).json({ message: "Update failed" });
  }
};


exports.deleteReadNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const [result] = await db.execute(
      `
      DELETE FROM notification
      WHERE user_id = ?
        AND is_read = 1
      `,
      [userId]
    );

    return res.json({
      message: "Read notifications deleted",
      deleted_count: result.affectedRows,
    });
  } catch (error) {
    console.error("DELETE READ NOTIFICATIONS ERROR:", error);
    return res.status(500).json({ message: "Delete failed" });
  }
};
