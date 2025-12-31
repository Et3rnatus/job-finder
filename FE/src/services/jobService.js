import axios from "axios";

const API_URL = "http://127.0.0.1:3001/api";

// ================= TOKEN =================
const getToken = () => localStorage.getItem("token");

// ================= PUBLIC =================

// Lấy danh sách job (trang chủ)
export const getJobs = async () => {
  const res = await axios.get(`${API_URL}/jobs`);
  return res.data;
};

// Lấy chi tiết job
export const getJobDetail = async (id) => {
  const res = await axios.get(`${API_URL}/jobs/${id}`);
  return res.data;
};

// ================= EMPLOYER =================

// Tạo tin tuyển dụng
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

  const res = await axios.post(`${API_URL}/jobs`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
