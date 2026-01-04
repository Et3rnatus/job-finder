import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import employerService from "../../services/employerService";

const JOB_STATUS = {
  active: {
    text: "Đang tuyển",
    badge: "bg-green-100 text-green-700",
  },
  pending: {
    text: "Chờ duyệt",
    badge: "bg-yellow-100 text-yellow-700",
  },
  rejected: {
    text: "Bị từ chối",
    badge: "bg-red-100 text-red-700",
  },
  closed: {
    text: "Đã đóng",
    badge: "bg-gray-100 text-gray-600",
  },
  expired: {
    text: "Hết hạn",
    badge: "bg-gray-100 text-gray-600",
  },
};

function EmployerJobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  /* =====================
     FETCH JOBS
  ===================== */
  const fetchJobs = async () => {
    try {
      const data = await employerService.getMyJobs();
      setJobs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("FETCH JOBS ERROR:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  /* =====================
     JOB ACTIONS
  ===================== */
  const handleCloseJob = async (jobId) => {
    if (!window.confirm("Bạn có chắc muốn đóng tuyển dụng?")) return;

    try {
      await employerService.closeJob(jobId);
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId ? { ...j, status: "closed" } : j
        )
      );
    } catch (e) {
      alert(
        e.response?.data?.message ||
          "Không thể đóng tuyển dụng"
      );
    }
  };

  const handleReopenJob = async (jobId) => {
    if (!window.confirm("Mở lại tuyển dụng cho công việc này?")) return;

    try {
      await employerService.reopenJob(jobId);
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId ? { ...j, status: "active" } : j
        )
      );
    } catch (e) {
      alert(
        e.response?.data?.message ||
          "Không thể mở lại tuyển dụng"
      );
    }
  };

  // ⭐ RE-SUBMIT JOB (SAU KHI BỊ REJECT)
  const handleResubmitJob = async (jobId) => {
    if (!window.confirm("Gửi lại job để admin duyệt?")) return;

    try {
      await employerService.resubmitJob(jobId);

      // 🔑 reload để UI cập nhật pending + ẩn admin_note
      await fetchJobs();

      alert("Job đã được gửi lại để admin duyệt");
    } catch (e) {
      alert(
        e.response?.data?.message ||
          "Không thể gửi lại job"
      );
    }
  };

  /* =====================
     EMPTY
  ===================== */
  if (!loading && jobs.length === 0) {
    return (
      <div className="bg-white border rounded-xl p-12 text-center">
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-xl font-semibold mb-2">
          Chưa có tin tuyển dụng
        </h3>
        <p className="text-gray-600 mb-6">
          Hãy tạo tin tuyển dụng đầu tiên để bắt đầu nhận hồ sơ
        </p>
        <button
          onClick={() => navigate("/employer/jobs/create")}
          className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700"
        >
          Đăng tin ngay
        </button>
      </div>
    );
  }

  /* =====================
     LIST
  ===================== */
  return (
    <div className="bg-white border rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-6">
        Việc làm đã đăng ({jobs.length})
      </h3>

      {loading && (
        <p className="text-sm text-gray-500">
          Đang tải dữ liệu...
        </p>
      )}

      <div className="space-y-4">
        {jobs.map((job) => {
          const status =
            JOB_STATUS[job.status] || JOB_STATUS.active;

          const totalApplicants =
            job.total_applications || 0;

          return (
            <div
              key={job.id}
              className="
                border rounded-xl p-5
                hover:shadow-md hover:border-green-500
                transition
              "
            >
              {/* HEADER */}
              <div className="flex justify-between gap-6">
                <div className="min-w-0">
                  <h4 className="text-lg font-semibold text-gray-800 truncate">
                    {job.title}
                  </h4>

                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${status.badge}`}
                  >
                    {status.text}
                  </span>

                  {/* 🔴 ADMIN REJECT NOTE */}
                  {job.status === "rejected" &&
                    job.admin_note && (
                      <div className="mt-3 bg-red-50 border border-red-300 p-3 rounded">
                        <p className="text-sm font-semibold text-red-600">
                          Lý do bị từ chối
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {job.admin_note}
                        </p>
                      </div>
                    )}

                  {/* 🟡 PENDING MESSAGE */}
                  {job.status === "pending" && (
                    <p className="text-sm text-yellow-700 mt-3">
                      Job đang chờ admin duyệt lại
                    </p>
                  )}

                  {/* STATS */}
                  <div className="flex flex-wrap gap-3 mt-4 text-sm">
                    <Stat
                      label="Tổng"
                      value={totalApplicants}
                    />
                    <Stat
                      label="Chờ"
                      value={job.pending_count || 0}
                      color="yellow"
                    />
                    <Stat
                      label="Duyệt"
                      value={job.approved_count || 0}
                      color="green"
                    />
                    <Stat
                      label="Từ chối"
                      value={job.rejected_count || 0}
                      color="red"
                    />
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col gap-2 min-w-[170px]">
                  <button
                    disabled={totalApplicants === 0}
                    title={
                      totalApplicants === 0
                        ? "Chưa có ứng viên cho công việc này"
                        : ""
                    }
                    onClick={() =>
                      navigate(
                        `/employer/jobs/${job.id}/applications`,
                        {
                          state: {
                            from:
                              location.pathname +
                              location.search,
                          },
                        }
                      )
                    }
                    className={`
                      w-full px-4 py-2 text-sm rounded transition
                      ${
                        totalApplicants === 0
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }
                    `}
                  >
                    Xem ứng viên
                  </button>

                  {/* RE-SUBMIT */}
                  {job.status === "rejected" && (
                    <button
                      onClick={() =>
                        handleResubmitJob(job.id)
                      }
                      className="
                        w-full px-4 py-2 text-sm
                        bg-blue-600 text-white rounded
                        hover:bg-blue-700
                      "
                    >
                      Re-submit Job
                    </button>
                  )}

                  {job.status === "active" && (
                    <button
                      onClick={() =>
                        handleCloseJob(job.id)
                      }
                      className="
                        w-full px-4 py-2 text-sm
                        bg-red-100 text-red-600 rounded
                        hover:bg-red-200
                      "
                    >
                      Đóng tuyển dụng
                    </button>
                  )}

                  {job.status === "closed" && (
                    <button
                      onClick={() =>
                        handleReopenJob(job.id)
                      }
                      className="
                        w-full px-4 py-2 text-sm
                        bg-blue-100 text-blue-600 rounded
                        hover:bg-blue-200
                      "
                    >
                      Mở lại tuyển dụng
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =====================
   SUB COMPONENT
===================== */
function Stat({ label, value, color = "gray" }) {
  const colorMap = {
    gray: "bg-gray-100 text-gray-700",
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colorMap[color]}`}
    >
      {label}: {value}
    </span>
  );
}

export default EmployerJobList;
