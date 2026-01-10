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

// GET /api/admin/dashboard/trends
export const getDashboardTrends = async () => {
  const res = await axios.get(
    `${API_URL}/dashboard/trends`,
    { headers: getAuthHeader() }
  );
  return res.data;
};

export const getJobTrends = async () => {
  const res = await axios.get(
    `${API_URL}/job-trends`,
    { headers: getAuthHeader() }
  );
  return res.data;
};

export const getJobTrends24h = async () => {
  const res = await axios.get(
    `${API_URL}/dashboard/job-trends-24h`,
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
  await axios.patch(
    `${API_URL}/jobs/${id}/approve`,
    {},
    { headers: getAuthHeader() }
  );
};

// PATCH /api/admin/jobs/:id/reject
export const rejectJob = async (id, admin_note) => {
  await axios.patch(
    `${API_URL}/jobs/${id}/reject`,
    { admin_note },
    { headers: getAuthHeader() }
  );
};

// GET /api/admin/jobs/:id/logs
export const getJobLogs = async (jobId) => {
  const res = await axios.get(
    `${API_URL}/jobs/${jobId}/logs`,
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
  await axios.patch(
    `${API_URL}/users/${id}/status`,
    { status },
    { headers: getAuthHeader() }
  );
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
  await axios.post(
    `${API_URL}/categories`,
    { name },
    { headers: getAuthHeader() }
  );
};

// PATCH /api/admin/categories/:id/toggle
export const toggleCategory = async (id) => {
  await axios.patch(
    `${API_URL}/categories/${id}/toggle`,
    {},
    { headers: getAuthHeader() }
  );
};

/* =========================
   PAYMENT MANAGEMENT (NEW)
========================= */

// GET /api/admin/payments
export const getPayments = async () => {
  const res = await axios.get(
    `${API_URL}/payments`,
    { headers: getAuthHeader() }
  );
  return res.data;
};

// POST /api/admin/payments/approve
export const approvePayment = async (orderId) => {
  const res = await axios.post(
    `${API_URL}/payments/approve`,
    { orderId },
    { headers: getAuthHeader() }
  );
  return res.data;
};
