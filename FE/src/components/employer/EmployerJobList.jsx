import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import employerService from "../../services/employerService";
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  PauseCircle,
  RefreshCcw,
  AlertTriangle,
  FilePlus2,
} from "lucide-react";

/* =====================
   JOB STATUS CONFIG
===================== */
const JOB_STATUS = {
  draft: {
    text: "Bản nháp",
    badge: "bg-gray-50 text-gray-600 border-gray-200",
    icon: <PauseCircle size={14} />,
  },
  pending: {
    text: "Chờ duyệt",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock size={14} />,
  },
  approved: {
    text: "Đang tuyển",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <CheckCircle2 size={14} />,
  },
  rejected: {
    text: "Bị từ chối",
    badge: "bg-red-50 text-red-700 border-red-200",
    icon: <XCircle size={14} />,
  },
};

export default function EmployerJobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchJobs = async () => {
    try {
      const data = await employerService.getMyJobs();
      setJobs(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  /* =====================
     ACTIONS
  ===================== */

  // ĐÓNG TUYỂN DỤNG → chuyển về pending (chờ admin duyệt lại)
  const handleCloseJob = async (jobId) => {
    if (!window.confirm("Đóng tuyển dụng?")) return;
    await employerService.closeJob(jobId);
    setJobs((p) =>
      p.map((j) =>
        j.id === jobId ? { ...j, status: "pending" } : j
      )
    );
  };

  // GỬI LẠI DUYỆT
  const handleResubmitJob = async (jobId) => {
    if (!window.confirm("Gửi lại để duyệt?")) return;
    await employerService.resubmitJob(jobId);
    fetchJobs();
  };

  /* =====================
     EMPTY STATE
  ===================== */
  if (!loading && jobs.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-3xl p-20 text-center shadow-sm">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <FilePlus2 size={32} />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          Chưa có tin tuyển dụng
        </h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Đăng tin để tiếp cận ứng viên phù hợp
        </p>
        <button
          onClick={() => navigate("/employer/jobs/create")}
          className="px-10 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
        >
          Đăng tin ngay
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm">
      {/* HEADER */}
      <div className="flex items-center gap-2 p-6 border-b">
        <Briefcase size={20} className="text-emerald-600" />
        <h3 className="text-xl font-semibold">
          Việc làm đã đăng
        </h3>
        <span className="text-sm text-gray-500">
          ({jobs.length})
        </span>
      </div>

      {loading && (
        <p className="p-6 text-sm text-gray-500">
          Đang tải dữ liệu...
        </p>
      )}

      <div className="p-6 grid gap-4">
        {jobs.map((job) => {
          const status =
            JOB_STATUS[job.status] || JOB_STATUS.pending;

          const totalApplicants =
            job.total_applications || 0;

          return (
            <div
              key={job.id}
              className="border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-emerald-500 transition bg-white"
            >
              <div className="flex flex-wrap justify-between gap-6">
                {/* LEFT */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 truncate">
                    {job.title}
                  </h4>

                  <span
                    className={`inline-flex items-center gap-1 mt-2 px-3 py-1 text-xs font-semibold rounded-full border ${status.badge}`}
                  >
                    {status.icon}
                    {status.text}
                  </span>

                  {job.status === "rejected" && job.admin_note && (
                    <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-4 text-sm">
                      <div className="flex items-center gap-2 text-red-600 font-medium mb-1">
                        <AlertTriangle size={14} />
                        Lý do từ chối
                      </div>
                      <p className="text-gray-700">
                        {job.admin_note}
                      </p>
                    </div>
                  )}

                  {job.status === "pending" && (
                    <p className="mt-3 text-sm text-amber-700">
                      Tin đang chờ admin duyệt
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-5 text-xs">
                    <Stat label="Tổng" value={totalApplicants} />
                    <Stat label="Chờ" value={job.pending_count || 0} color="amber" />
                    <Stat label="Duyệt" value={job.approved_count || 0} color="emerald" />
                    <Stat label="Từ chối" value={job.rejected_count || 0} color="red" />
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <button
                    disabled={totalApplicants === 0}
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
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                      totalApplicants === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    <Users size={14} className="inline mr-1" />
                    Xem ứng viên
                  </button>

                  {job.status === "rejected" && (
                    <button
                      onClick={() => handleResubmitJob(job.id)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      <RefreshCcw size={14} className="inline mr-1" />
                      Gửi lại duyệt
                    </button>
                  )}

                  {job.status === "approved" && (
                    <button
                      onClick={() => handleCloseJob(job.id)}
                      className="px-4 py-2 rounded-xl text-sm bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      Đóng tuyển dụng
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
  const map = {
    gray: "bg-gray-100 text-gray-700 border-gray-200",
    amber: "bg-amber-100 text-amber-700 border-amber-200",
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    red: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full border font-semibold ${map[color]}`}
    >
      {label}: {value}
    </span>
  );
}
