import axios from "axios";

const API_URL = "http://127.0.0.1:3001/api";

const getToken = () => localStorage.getItem("token");

/**
 * GET ALL JOBS (OLD - KEEP)
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

/**
 * FILTER JOBS (NEW)
 * @param {Object} params
 * @param {number[]} params.categoryIds
 * @param {number[]} params.skillIds
 * @param {string} params.keyword
 * @param {string} params.city
 */
export const filterJobs = async (params = {}) => {
  const query = {};

  if (params.categoryIds?.length > 0) {
    query.categoryIds = params.categoryIds.join(",");
  }

  if (params.skillIds?.length > 0) {
    query.skillIds = params.skillIds.join(",");
  }

  if (params.keyword) {
    query.keyword = params.keyword;
  }

  if (params.city) {
    query.city = params.city;
  }

  const res = await axios.get(`${API_URL}/jobs/filter`, {
    params: query,
  });

  return res.data;
};

/**
 * GET JOB DETAIL
 */
export const getJobDetail = async (id) => {
  const res = await axios.get(`${API_URL}/jobs/${id}`);
  return res.data;
};

/**
 * CREATE JOB
 */
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
