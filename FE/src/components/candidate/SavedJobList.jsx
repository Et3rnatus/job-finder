import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSavedJobs,
  unsaveJob,
} from "../../services/savedJobService";

function SavedJobList() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      const data = await getSavedJobs();
      setJobs(Array.isArray(data) ? data : []);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleUnsave = async (jobId) => {
    const ok = window.confirm("Bỏ lưu công việc này?");
    if (!ok) return;

    try {
      await unsaveJob(jobId);
      // ✅ update UI ngay, không cần chờ refetch
      setJobs((prev) =>
        prev.filter((j) => j.job_id !== jobId)
      );
    } catch {
      alert("Không thể bỏ lưu công việc");
    }
  };

  /* =====================
     LOADING
  ===================== */
  if (loading) {
    return (
      <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
        Đang tải công việc đã lưu...
      </div>
    );
  }

  /* =====================
     EMPTY STATE
  ===================== */
  if (jobs.length === 0) {
    return (
      <div className="bg-white border rounded-xl p-12 flex flex-col items-center">
        <div className="text-7xl mb-6">📁</div>

        <h3 className="text-xl font-semibold mb-2">
          Chưa có công việc nào được lưu
        </h3>

        <p className="text-gray-600 mb-8 text-center">
          Hãy lưu những công việc bạn quan tâm để xem lại sau
        </p>

        <button
          onClick={() => navigate("/jobs")}
          className="
            px-8 py-3 bg-green-600 text-white
            rounded-full font-medium
            hover:bg-green-700 transition
          "
        >
          Khám phá việc làm →
        </button>
      </div>
    );
  }

  /* =====================
     LIST SAVED JOBS
  ===================== */
  return (
    <div className="bg-white border rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-6">
        💾 Công việc đã lưu ({jobs.length})
      </h2>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.job_id}
            className="
              border rounded-xl p-5
              hover:border-green-500 hover:shadow-md
              transition
            "
          >
            {/* HEADER */}
            <div className="flex justify-between gap-4">
              <div className="min-w-0">
                {/* TITLE → ĐI SANG DETAIL + TRUYỀN FROM */}
                <h3
                  onClick={() =>
                    navigate(`/jobs/${job.job_id}`, {
                      state: { from: "/account/saved-jobs" },
                    })
                  }
                  className="
                    text-lg font-semibold text-gray-800
                    cursor-pointer hover:text-green-600
                    truncate
                  "
                >
                  {job.title}
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  {job.company_name}
                </p>
              </div>

              <button
                onClick={() => handleUnsave(job.job_id)}
                className="
                  text-sm text-red-500 hover:text-red-600
                  whitespace-nowrap
                "
              >
                ✕ Bỏ lưu
              </button>
            </div>

            {/* META */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
              <span>📍 {job.location}</span>
              <span>
                💰 {job.min_salary} – {job.max_salary}
              </span>
            </div>

            {/* ACTION */}
            <div className="mt-5 flex justify-end">
              <button
                onClick={() =>
                  navigate(`/jobs/${job.job_id}`, {
                    state: { from: "/account/saved-jobs" },
                  })
                }
                className="
                  px-5 py-2 text-sm
                  border border-green-600 text-green-600
                  rounded-full hover:bg-green-50
                  transition
                "
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedJobList;
