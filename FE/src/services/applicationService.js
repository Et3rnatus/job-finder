import axios from "axios";

const API_URL = "http://127.0.0.1:3001/api/applications";

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

/**
 * =========================
 * Candidate xem danh sách job đã ứng tuyển
 * GET /applications/me
 * =========================
 */
export const getMyApplications = async () => {
  const res = await axios.get(`${API_URL}/me`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

/**
 * =========================
 * Candidate apply job
 * POST /applications
 * =========================
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

/**
 * =========================
 * Candidate hủy ứng tuyển
 * PATCH /applications/:id/cancel
 * =========================
 */
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

/**
 * =========================
 * Candidate check đã apply job chưa
 * GET /applications/check/:jobId
 * 👉 BE trả: { applied: boolean, status: string | null }
 * =========================
 */
export const checkApplied = async (jobId) => {
  if (!jobId) {
    return { applied: false, status: null };
  }

  const res = await axios.get(
    `${API_URL}/check/${jobId}`,
    { headers: getAuthHeader() }
  );

  return res.data;
};

/**
 * =========================
 * Employer xem danh sách ứng viên theo job
 * GET /applications/job/:jobId
 * =========================
 */
export const getApplicantsByJob = async (jobId) => {
  const res = await axios.get(`${API_URL}/job/${jobId}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

/**
 * =========================
 * Employer duyệt / từ chối hồ sơ
 * PATCH /applications/:id/status
 * =========================
 */
export const updateApplicationStatus = async (id, status) => {
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
