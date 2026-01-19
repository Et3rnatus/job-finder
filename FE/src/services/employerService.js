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
// UPLOAD LOGO (EMPLOYER) ⭐ NEW
// ======================

const updateLogo = async (file) => {
  const formData = new FormData();
  formData.append("logo", file);

  const res = await axios.put(`${API_URL}/logo`, formData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data; // 👈 trả nguyên object { message, logo }
};


// ======================
// JOBS (EMPLOYER)
// ======================

// GET /api/employer/jobs
const getMyJobs = async () => {
  const res = await axios.get(`${API_URL}/jobs`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// PATCH /api/employer/jobs/:id/close
const closeJob = async (jobId) => {
  const res = await axios.patch(
    `${API_URL}/jobs/${jobId}/close`,
    {},
    { headers: getAuthHeader() }
  );
  return res.data;
};

// PATCH /api/employer/jobs/:id/reopen
const reopenJob = async (jobId) => {
  const res = await axios.patch(
    `${API_URL}/jobs/${jobId}/reopen`,
    {},
    { headers: getAuthHeader() }
  );
  return res.data;
};

// PATCH /api/employer/jobs/:id/resubmit  ✅ NEW (TOPCV FLOW)
const resubmitJob = async (jobId) => {
  const res = await axios.patch(
    `${API_URL}/jobs/${jobId}/resubmit`,
    {},
    { headers: getAuthHeader() }
  );
  return res.data;
};

// ======================
// PAYMENT HISTORY ⭐ NEW
// ======================

const getPaymentHistory = async () => {
  const res = await axios.get(
    `${API_URL}/payment-history`,
    {
      headers: getAuthHeader(),
    }
  );
  return res.data; // { history: [...] }
};

const getPackageStatus = async () => {
  const res = await axios.get(`${API_URL}/package-status`, {
    headers: getAuthHeader(),
  });
  return res.data;
};


export default {
  // profile
  checkProfile,
  getProfile,
  updateProfile,

  // upload logo
  updateLogo, // ✅ EXPORT

  // jobs
  getMyJobs,
  closeJob,
  reopenJob,
  resubmitJob,
  getPaymentHistory,
  getPackageStatus,
};
