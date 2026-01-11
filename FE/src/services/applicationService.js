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
export const checkAppliedJob = async (jobId) => {
  if (!jobId) {
    return { applied: false };
  }

  try {
    const res = await axios.get(
      `${API_URL}/check/${jobId}`,
      { headers: getAuthHeader() }
    );
    return res.data;
  } catch {
    return { applied: false };
  }
};

// Candidate xem chi tiết hồ sơ đã ứng tuyển
export const getMyApplicationDetail = async (applicationId) => {
  if (!applicationId) {
    throw new Error("applicationId is required");
  }

  const res = await axios.get(
    `${API_URL}/candidate/${applicationId}`,
    {
      headers: getAuthHeader(),
    }
  );

  return res.data;
};

/* ================== EMPLOYER ================== */

// Nhà tuyển dụng xem danh sách ứng viên
export const getApplicantsByJob = async (jobId) => {
  if (!jobId) {
    throw new Error("jobId is required");
  }

  const res = await axios.get(
    `${API_URL}/jobs/${jobId}/applicants`,
    { headers: getAuthHeader() }
  );

  return res.data;
};

// Employer xem chi tiết 1 hồ sơ (snapshot)
export const getApplicationDetail = async (applicationId) => {
  if (!applicationId) {
    throw new Error("applicationId is required");
  }

  const res = await axios.get(
    `${API_URL}/${applicationId}`,
    {
      headers: getAuthHeader(),
    }
  );

  return res.data;
};

// Duyệt / từ chối hồ sơ
export const updateApplicationStatus = async (
  applicationId,
  status,
  reject_reason = null
) => {
  if (!["approved", "rejected"].includes(status)) {
    throw new Error("Invalid status");
  }

  const res = await axios.patch(
    `${API_URL}/${applicationId}/status`,
    {
      status,
      reject_reason,
    },
    {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
};

// 🔥 MỜI PHỎNG VẤN (MAILTRAP)
export const inviteToInterview = async (applicationId, data) => {
  if (!applicationId) {
    throw new Error("applicationId is required");
  }

  if (!data?.interview_time || !data?.interview_location) {
    throw new Error(
      "interview_time and interview_location are required"
    );
  }

  const res = await axios.put(
    `${API_URL}/${applicationId}/interview`,
    data,
    {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
};
