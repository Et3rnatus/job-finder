import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSavedJobs,
  unsaveJob,
} from "../../services/savedJobService";
import {
  Bookmark,
  BookmarkX,
  Briefcase,
  Building2,
  MapPin,
  Banknote,
  Loader2,
  AlertTriangle,
} from "lucide-react";

export default function SavedJobList() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const data = await getSavedJobs();
      setJobs(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = (jobId) => {
    setConfirm({
      title: "Bỏ lưu công việc",
      message:
        "Công việc này sẽ bị xóa khỏi danh sách đã lưu.",
      onConfirm: async () => {
        try {
          await unsaveJob(jobId);
          setJobs((prev) =>
            prev.filter((j) => j.job_id !== jobId)
          );
        } finally {
          setConfirm(null);
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Loader2 className="animate-spin" size={16} />
        Đang tải công việc đã lưu...
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center shadow-sm">
        <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
          <BookmarkX size={32} />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          Chưa có công việc nào được lưu
        </h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Lưu lại những công việc bạn quan tâm để
          theo dõi và ứng tuyển nhanh hơn.
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
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Bookmark size={20} />
            <h2 className="text-xl font-semibold">
              Công việc đã lưu
            </h2>
            <span className="text-sm text-gray-500">
              ({jobs.length})
            </span>
          </div>
        </div>

        {/* LIST */}
        <div className="p-6 grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.job_id}
              className="group border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-indigo-500 transition bg-white"
            >
              <div className="flex justify-between gap-4">
                <div className="min-w-0">
                  <h3
                    onClick={() =>
                      navigate(`/jobs/${job.job_id}`, {
                        state: {
                          from: "/account/saved-jobs",
                        },
                      })
                    }
                    className="text-lg font-semibold text-gray-800 cursor-pointer truncate flex items-center gap-2 group-hover:text-indigo-600"
                  >
                    <Briefcase size={16} />
                    {job.title}
                  </h3>

                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                    <Building2 size={14} />
                    {job.company_name}
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleUnsave(job.job_id)
                  }
                  className="text-sm text-gray-400 hover:text-red-600"
                >
                  <BookmarkX size={18} />
                </button>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-gray-500 mt-4">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Banknote size={14} />
                  {job.min_salary} –{" "}
                  {job.max_salary}
                </span>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() =>
                    navigate(`/jobs/${job.job_id}`, {
                      state: {
                        from: "/account/saved-jobs",
                      },
                    })
                  }
                  className="px-5 py-2 text-sm rounded-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl text-center">
            <AlertTriangle
              size={40}
              className="mx-auto text-red-600 mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">
              {confirm.title}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {confirm.message}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="px-4 py-2 rounded-xl border hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={confirm.onConfirm}
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
