import axios from "axios";

const API_URL = "http://127.0.0.1:3001/api/notifications";

/* =====================
   AUTH HEADER
===================== */
const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Unauthorized: No token found");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

/* =====================
   GET MY NOTIFICATIONS
===================== */
export const getMyNotifications = async () => {
  const res = await axios.get(`${API_URL}/me`, {
    headers: getAuthHeader(),
  });

  return res.data; 
  // expect: [{ id, type, title, message, related_id, is_read, created_at }]
};

/* =====================
   MARK AS READ
===================== */
export const markAsRead = async (notificationId) => {
  if (!notificationId) {
    throw new Error("notificationId is required");
  }

  const res = await axios.patch(
    `${API_URL}/${notificationId}/read`,
    null,
    {
      headers: getAuthHeader(),
    }
  );

  return res.data;
};
