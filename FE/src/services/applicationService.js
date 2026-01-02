import axios from "axios";

const API_URL = "http://127.0.0.1:3001/api/applications";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Chưa đăng nhập");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

/* ================== CANDIDATE ================== */

// Lấy danh sách job đã ứng tuyển
export const getMyApplications = async () => {
  const res = await axios.get(`${API_URL}/me`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// Ứng tuyển job
export const applyJob = async (data) => {
  if (!data?.job_id) {
    throw new Error("job_id is required");
  }

  const res = await axios.post(API_URL, data, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

// Hủy ứng tuyển
export const cancelApplication = async (applicationId) => {
  if (!applicationId) {
    throw new Error("applicationId is required");
  }

  const res = await axios.patch(
    `${API_URL}/${applicationId}/cancel`,
    {},
    {
      headers: getAuthHeader(),
    }
  );

  return res.data;
};

// Check đã ứng tuyển chưa
export const checkApplied = async (jobId) => {
  if (!jobId) {
    return { applied: false };
  }

  try {
    const res = await axios.get(
      `${API_URL}/check/${jobId}`,
      { headers: getAuthHeader() }
    );
    return res.data;
  } catch (error) {
    // 👉 chưa đăng nhập thì coi như chưa apply
    return { applied: false };
  }
};

/* ================== EMPLOYER ================== */

// Nhà tuyển dụng xem ứng viên
export const getApplicantsByJob = async (jobId) => {
  const res = await axios.get(`${API_URL}/job/${jobId}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// Duyệt / từ chối hồ sơ
export const updateApplicationStatus = async (id, status) => {
  if (!["approved", "rejected"].includes(status)) {
    throw new Error("Invalid status");
  }

  const res = await axios.patch(
    `${API_URL}/${id}/status`,
    { status },
    {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
};
