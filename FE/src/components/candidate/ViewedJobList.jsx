import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Briefcase,
  Building2,
  MapPin,
  Clock,
  Trash2,
  AlertTriangle,
} from "lucide-react";

export default function ViewedJobList() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [confirm, setConfirm] = useState(false);

  /* =====================
     LOAD VIEWED JOBS
  ===================== */
  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("viewed_jobs") || "[]"
      );

      if (!Array.isArray(stored)) {
        setJobs([]);
        return;
      }

      const sorted = stored
        .filter(
          (j) =>
            j &&
            j.id &&
            j.title &&
            j.viewedAt
        )
        .sort(
          (a, b) =>
            new Date(b.viewedAt) -
            new Date(a.viewedAt)
        );

      setJobs(sorted);
    } catch {
      setJobs([]);
    }
  }, []);

  /* =====================
     CLEAR HISTORY
  ===================== */
  const handleClearHistory = () => {
    setConfirm(true);
  };

  const confirmClear = () => {
    localStorage.removeItem("viewed_jobs");
    setJobs([]);
    setConfirm(false);
  };

  /* =====================
     EMPTY STATE
  ===================== */
  if (!jobs.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center shadow-sm">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
          <Eye size={32} />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          Chưa có công việc nào được xem
        </h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Các công việc bạn đã xem sẽ xuất hiện tại
          đây để bạn dễ dàng quay lại sau.
        </p>
        <button
          onClick={() => navigate("/jobs")}
          className="px-8 py-3 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
        >
          Khám phá việc làm
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm">
        {/* =====================
            HEADER
        ===================== */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b">
          <div className="flex items-center gap-2">
            <Eye size={20} className="text-indigo-600" />
            <h2 className="text-xl font-semibold">
              Công việc đã xem
            </h2>
            <span className="text-sm text-gray-500">
              ({jobs.length})
            </span>
          </div>

          <button
            onClick={handleClearHistory}
            className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline"
          >
            <Trash2 size={14} />
            Xóa lịch sử
          </button>
        </div>

        {/* =====================
            LIST
        ===================== */}
        <div className="p-6 grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() =>
                navigate(`/jobs/${job.id}`, {
                  state: {
                    from:
                      "/candidate/viewed-jobs",
                  },
                })
              }
              className="group border border-gray-200 rounded-2xl p-5 cursor-pointer bg-white hover:border-indigo-500 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 flex items-center gap-2 truncate">
                <Briefcase size={16} />
                {job.title}
              </h3>

              <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                <Building2 size={14} />
                {job.company}
              </p>

              <div className="flex flex-wrap justify-between items-center gap-4 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {new Date(
                    job.viewedAt
                  ).toLocaleString("vi-VN")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =====================
          CONFIRM MODAL
      ===================== */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl text-center">
            <AlertTriangle
              size={40}
              className="mx-auto text-red-600 mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">
              Xóa lịch sử đã xem
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Toàn bộ lịch sử công việc đã xem sẽ
              bị xóa vĩnh viễn.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirm(false)}
                className="px-4 py-2 rounded-xl border hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={confirmClear}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
