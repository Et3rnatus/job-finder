import axios from "axios";

const API_URL = "http://127.0.0.1:3001/api/saved-jobs";

/* =====================
   AUTH HEADER
===================== */
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Chưa đăng nhập");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

/* =====================
   LƯU CÔNG VIỆC
===================== */
export const saveJob = async (jobId) => {
  if (!jobId) {
    throw new Error("jobId is required");
  }

  const res = await axios.post(
    API_URL,
    { job_id: jobId },
    {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
};

/* =====================
   BỎ LƯU CÔNG VIỆC
===================== */
export const unsaveJob = async (jobId) => {
  if (!jobId) {
    throw new Error("jobId is required");
  }

  const res = await axios.delete(`${API_URL}/${jobId}`, {
    headers: getAuthHeader(),
  });

  return res.data;
};

/* =====================
   DANH SÁCH JOB ĐÃ LƯU
===================== */
export const getSavedJobs = async () => {
  const res = await axios.get(API_URL, {
    headers: getAuthHeader(),
  });

  return res.data;
};

/* =====================
   CHECK JOB ĐÃ LƯU CHƯA
===================== */
export const checkSavedJob = async (jobId) => {
  if (!jobId) {
    throw new Error("jobId is required");
  }

  const res = await axios.get(
    `${API_URL}/check/${jobId}`,
    {
      headers: getAuthHeader(),
    }
  );

  return res.data;
};
