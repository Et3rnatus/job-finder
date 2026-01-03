import axios from "axios";

const API_URL = "http://127.0.0.1:3001/api/employer";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// ======================
// PROFILE
// ======================

const checkProfile = async () => {
  const res = await axios.get(`${API_URL}/check-profile`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

const getProfile = async () => {
  const res = await axios.get(`${API_URL}/profile`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

const updateProfile = async (data) => {
  const res = await axios.put(`${API_URL}/profile`, data, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// ======================
// JOBS (EMPLOYER)
// ======================

const getMyJobs = async () => {
  const res = await axios.get(`${API_URL}/jobs`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// ✅ THÊM HÀM ĐÓNG TUYỂN DỤNG
const closeJob = async (jobId) => {
  const res = await axios.patch(
    `http://127.0.0.1:3001/api/jobs/${jobId}/close`,
    {},
    {
      headers: getAuthHeader(),
    }
  );
  return res.data;
};

const reopenJob = async (jobId) => {
  const res = await axios.patch(
    `http://127.0.0.1:3001/api/jobs/${jobId}/reopen`,
    {},
    { headers: getAuthHeader() }
  );
  return res.data;
};

export default {
  checkProfile,
  getProfile,
  updateProfile,
  getMyJobs,
  closeJob,
  reopenJob // 👈 QUAN TRỌNG
};
