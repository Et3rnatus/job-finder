import axios from "axios";

const API_URL = "http://127.0.0.1:3001/api/employer";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * 1️⃣ Check hồ sơ đã hoàn thiện hay chưa
 */
const checkProfile = async () => {
  const res = await axios.get(`${API_URL}/check-profile`, {
    headers: getAuthHeader(),
  });
  return res.data; // { completed: true/false }
};

/**
 * 2️⃣ Lấy hồ sơ công ty (đổ form)
 */
const getProfile = async () => {
  const res = await axios.get(`${API_URL}/profile`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

/**
 * 3️⃣ Cập nhật hồ sơ công ty
 */
const updateProfile = async (data) => {
  const res = await axios.put(`${API_URL}/profile`, data, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export default {
  checkProfile,
  getProfile,
  updateProfile,
};
