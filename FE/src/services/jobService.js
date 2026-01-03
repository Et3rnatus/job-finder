import axios from "axios";

const API_URL = "http://127.0.0.1:3001/api";

const getToken = () => localStorage.getItem("token");

/**
 * @param {Object} params
 * @param {string} params.keyword
 * @param {string} params.city
 */
export const getJobs = async (params = {}) => {
  const res = await axios.get(`${API_URL}/jobs`, {
    params,
  });
  return res.data;
};

export const getJobDetail = async (id) => {
  const res = await axios.get(`${API_URL}/jobs/${id}`);
  return res.data;
};

export const createJob = async (data) => {
  const token = getToken();

  if (!token) {
    throw new Error("Chưa đăng nhập");
  }

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