import axios from "axios";

const API_URL = "http://127.0.0.1:3001/api/notifications";

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});


export const getMyNotifications = async () => {
  const res = await axios.get(`${API_URL}/me`, {
    headers: getAuthHeader(),
  });
  return res.data;
};


export const markAsRead = async (id) => {
  if (!id) {
    throw new Error("notification id is required");
  }

  const res = await axios.patch(
    `${API_URL}/${id}/read`,
    {},
    {
      headers: getAuthHeader(),
    }
  );

  return res.data;
};
