import axios from "axios";

const API_URL = "http://127.0.0.1:3001/api";
const getToken = () => localStorage.getItem("token");

// Public
export const getJobs = async () => {
  const res = await axios.get(`${API_URL}/jobs`);
  return res.data;
};

export const getJobDetail = async (id) => {
  const res = await axios.get(`${API_URL}/jobs/${id}`);
  return res.data;
};

// Employer
export const getMyJobs = async () => {
  const res = await axios.get(`${API_URL}/employers/jobs`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.data;
};

export const createJob = async (data) => {
  const res = await axios.post(`${API_URL}/jobs`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.data;
};

export const getApplicationsByJob = async (jobId) => {
  const res = await axios.get(
    `${API_URL}/employers/applications/${jobId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  return res.data;
};
