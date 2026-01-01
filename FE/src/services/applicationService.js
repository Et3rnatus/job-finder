import axios from "axios";

const API_URL = "http://127.0.0.1:3001/api/applications";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Candidate xem danh sách job đã ứng tuyển
 * GET /applications/me
 */
export const getMyApplications = async () => {
  const res = await axios.get(`${API_URL}/me`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

/**
 * Candidate apply job
 * POST /applications
 */
export const applyJob = async (data) => {
  const res = await axios.post(API_URL, data, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  });
  return res.data;
};
export const cancelApplication = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};
