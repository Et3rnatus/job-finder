import axios from "axios";

const API_URL = "http://127.0.0.1:3001/api/notifications";

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getMyNotifications = async () => {
  const res = await axios.get(API_URL, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const markAsRead = async (id) => {
  await axios.patch(`${API_URL}/${id}/read`, {}, {
    headers: getAuthHeader(),
  });
};
