import axios from "axios";

const API_URL = "http://127.0.0.1:3001/api/candidate";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * 1️⃣ Lấy toàn bộ hồ sơ ứng viên
 * GET /api/candidate/profile
 */
const getProfile = async () => {
  const res = await axios.get(`${API_URL}/profile`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

/**
 * 2️⃣ Check hồ sơ đã hoàn thiện hay chưa
 * GET /api/candidate/check-profile
 */
const checkProfile = async () => {
  const res = await axios.get(`${API_URL}/check-profile`, {
    headers: getAuthHeader(),
  });
  return res.data; // { is_profile_completed: true/false }
};

/**
 * 3️⃣ Cập nhật hồ sơ ứng viên
 * PUT /api/candidate/profile
 */
const updateProfile = async (data) => {
  const res = await axios.put(`${API_URL}/profile`, data, {
    headers: getAuthHeader(),
  });

  // { message, is_profile_completed }
  return res.data;
};

export default {
  getProfile,
  checkProfile,
  updateProfile,
};
