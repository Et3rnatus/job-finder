import axios from "axios";

const API_URL = "http://127.0.0.1:3001/api";

// Lấy token từ localStorage
const getToken = () => localStorage.getItem("token");

// ================= PUBLIC =================
export const getJobs = async () => {
  const res = await axios.get(`${API_URL}/jobs`);
  return res.data;
};

export const getJobDetail = async (id) => {
  const res = await axios.get(`${API_URL}/jobs/${id}`);
  return res.data;
};

// ================= EMPLOYER =================
export const getMyJobs = async () => {
  const token = getToken();

  if (!token) {
    throw new Error("Chưa đăng nhập");
  }

  const res = await axios.get(`${API_URL}/employers/jobs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const createJob = async (data) => {
  const token = getToken();

  if (!token) {
    throw new Error("Chưa đăng nhập");
  }

  // Ép kiểu để tránh lỗi DB
  const payload = {
    ...data,
    min_salary: data.min_salary ? Number(data.min_salary) : null,
    max_salary: data.max_salary ? Number(data.max_salary) : null,
  };

  axios.post(
  `${API_URL}/employers/jobs`,
  payload,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

  return res.data;
};

export const getApplicationsByJob = async (jobId) => {
  const token = getToken();

  if (!token) {
    throw new Error("Chưa đăng nhập");
  }

  const res = await axios.get(
    `${API_URL}/employers/applications/${jobId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
