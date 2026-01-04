import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ViewedJobList() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("viewed_jobs") || "[]"
    );
    setJobs(stored);
  }, []);

  /* =====================
     EMPTY STATE
  ===================== */
  if (jobs.length === 0) {
    return (
      <div className="bg-white border rounded-xl p-12 text-center">
        <div className="text-6xl mb-4">👀</div>
        <h3 className="text-xl font-semibold mb-2">
          Chưa có công việc nào được xem
        </h3>
        <p className="text-gray-600 mb-6">
          Khi bạn xem chi tiết công việc, chúng sẽ xuất hiện ở đây
        </p>

        <button
          onClick={() => navigate("/jobs")}
          className="px-6 py-3 bg-green-600 text-white rounded-full"
        >
          Khám phá việc làm →
        </button>
      </div>
    );
  }

  /* =====================
     LIST VIEWED JOBS
  ===================== */
  return (
    <div className="bg-white border rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-6">
        👀 Công việc đã xem
      </h2>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={() =>
              navigate(`/jobs/${job.id}`, {
                state: { from: "/candidate/viewed-jobs" },
              })
            }
            className="
              border rounded-xl p-5
              cursor-pointer
              hover:border-green-500 hover:shadow-md
              transition
            "
          >
            <h3 className="text-lg font-semibold text-gray-800 hover:text-green-600">
              {job.title}
            </h3>

            <p className="text-sm text-gray-600 mt-1">
              {job.company}
            </p>

            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <span>📍 {job.location}</span>
              <span>
                {new Date(job.viewedAt).toLocaleString("vi-VN")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewedJobList;
