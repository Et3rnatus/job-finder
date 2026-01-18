import axios from "axios";

const API_URL = "http://127.0.0.1:3001/api/admin";

/* =========================
   AUTH HEADER
========================= */
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

/* =========================
   DASHBOARD
========================= */

// GET /api/admin/dashboard
export const getDashboard = async () => {
  const res = await axios.get(`${API_URL}/dashboard`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// GET /api/admin/dashboard/job-trends
export const getJobTrends = async () => {
  const res = await axios.get(
    `${API_URL}/dashboard/job-trends`,
    { headers: getAuthHeader() }
  );
  return res.data;
};

/* =========================
   JOB MODERATION
========================= */

// GET /api/admin/jobs?status=pending
export const getJobs = async (status = "pending") => {
  const res = await axios.get(
    `${API_URL}/jobs?status=${status}`,
    { headers: getAuthHeader() }
  );
  return res.data;
};

// GET /api/admin/jobs/:id
export const getJobDetailForAdmin = async (jobId) => {
  const res = await axios.get(
    `${API_URL}/jobs/${jobId}`,
    { headers: getAuthHeader() }
  );
  return res.data;
};

// PATCH /api/admin/jobs/:id/approve
export const approveJob = async (id) => {
  const res = await axios.patch(
    `${API_URL}/jobs/${id}/approve`,
    {},
    { headers: getAuthHeader() }
  );
  return res.data;
};

// PATCH /api/admin/jobs/:id/reject
export const rejectJob = async (id, admin_note) => {
  const res = await axios.patch(
    `${API_URL}/jobs/${id}/reject`,
    { admin_note },
    { headers: getAuthHeader() }
  );
  return res.data;
};

/* =========================
   USER MANAGEMENT
========================= */

// GET /api/admin/users
export const getUsers = async () => {
  const res = await axios.get(`${API_URL}/users`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// PATCH /api/admin/users/:id/status
export const updateUserStatus = async (id, status) => {
  const res = await axios.patch(
    `${API_URL}/users/${id}/status`,
    { status },
    { headers: getAuthHeader() }
  );
  return res.data;
};

/* =========================
   CATEGORY MANAGEMENT
========================= */

// GET /api/admin/categories
export const getCategories = async () => {
  const res = await axios.get(`${API_URL}/categories`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// POST /api/admin/categories
export const createCategory = async (name) => {
  const res = await axios.post(
    `${API_URL}/categories`,
    { name },
    { headers: getAuthHeader() }
  );
  return res.data;
};

// PATCH /api/admin/categories/:id/toggle
export const toggleCategory = async (id) => {
  const res = await axios.patch(
    `${API_URL}/categories/${id}/toggle`,
    {},
    { headers: getAuthHeader() }
  );
  return res.data;
};
