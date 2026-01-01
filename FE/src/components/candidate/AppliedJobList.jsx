import { useEffect, useState } from "react";
import {
  getMyApplications,
  cancelApplication,
} from "../../services/applicationService";

const statusMap = {
  pending: {
    text: "Đang chờ xử lý",
    className: "text-yellow-600",
  },
  approved: {
    text: "Được chấp nhận",
    className: "text-green-600",
  },
  rejected: {
    text: "Bị từ chối",
    className: "text-red-600",
  },
};

function AppliedJobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      const data = await getMyApplications();
      setJobs(data);
    } catch (error) {
      console.error("LOAD APPLIED JOBS ERROR:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    const ok = window.confirm("Bạn có chắc muốn hủy ứng tuyển công việc này?");
    if (!ok) return;

    try {
      await cancelApplication(id);
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (error) {
      alert(
        error?.response?.data?.message || "Hủy ứng tuyển thất bại"
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-white border rounded-lg p-6 mt-6">
        Đang tải danh sách công việc đã ứng tuyển...
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
      {/* HEADER */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Công việc đã ứng tuyển
      </h3>

      {jobs.length === 0 ? (
        <p className="text-sm text-gray-500">
          Bạn chưa ứng tuyển công việc nào.
        </p>
      ) : (
        <>
          {/* TABLE HEADER */}
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600 border-b pb-2">
            <div>Công việc</div>
            <div>Công ty</div>
            <div>Ngày ứng tuyển</div>
            <div>Trạng thái</div>
          </div>

          {/* TABLE BODY */}
          <div className="divide-y">
            {jobs.map((job) => {
              const status = statusMap[job.status] || statusMap.pending;

              return (
                <div
                  key={job.id}
                  className="grid grid-cols-4 gap-4 py-3 text-sm text-gray-700"
                >
                  <div className="font-medium text-gray-800">
                    {job.job_title}
                  </div>

                  <div>{job.company_name}</div>

                  <div>
                    {job.applied_at
                      ? new Date(job.applied_at).toLocaleDateString("vi-VN")
                      : "-"}
                  </div>

                  <div className={`${status.className} font-medium`}>
                    {status.text}

                    {/* 🔴 HỦY ỨNG TUYỂN (CHỈ KHI PENDING) */}
                    {job.status === "pending" && (
                      <button
                        onClick={() => handleCancel(job.id)}
                        className="block text-xs text-red-600 hover:underline mt-1"
                      >
                        Hủy ứng tuyển
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default AppliedJobList;
