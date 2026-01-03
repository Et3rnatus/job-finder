import { useEffect, useState } from "react";
import {
  getMyApplications,
  cancelApplication,
  applyJob,
} from "../../services/applicationService";
import {
  Briefcase,
  Building2,
  CalendarDays,
  XCircle,
  RotateCcw,
  Loader2,
} from "lucide-react";

const statusMap = {
  pending: {
    text: "Đang chờ xử lý",
    className: "text-yellow-600 bg-yellow-50",
  },
  approved: {
    text: "Được chấp nhận",
    className: "text-green-600 bg-green-50",
  },
  rejected: {
    text: "Bị từ chối",
    className: "text-red-600 bg-red-50",
  },
  cancelled: {
    text: "Đã hủy ứng tuyển",
    className: "text-gray-500 bg-gray-100",
  },
};

function AppliedJobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      const data = await getMyApplications();
      const safeData = Array.isArray(data)
        ? data.filter(
            (item) => item && item.id && item.job_id && item.status
          )
        : [];
      setJobs(safeData);
    } catch (error) {
      console.error("LOAD APPLIED JOBS ERROR:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (applicationId) => {
    if (!window.confirm("Bạn có chắc muốn hủy ứng tuyển?")) return;

    try {
      setProcessingId(applicationId);
      await cancelApplication(applicationId);
      fetchAppliedJobs();
    } catch {
      alert("Hủy ứng tuyển thất bại");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReApply = async (jobId) => {
    if (!window.confirm("Bạn có muốn ứng tuyển lại công việc này?")) return;

    try {
      setProcessingId(jobId);
      await applyJob({ job_id: jobId });
      fetchAppliedJobs();
    } catch (error) {
      alert(
        error?.response?.data?.message || "Ứng tuyển lại thất bại"
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Loader2 className="animate-spin" size={16} />
        Đang tải danh sách công việc đã ứng tuyển...
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl p-6 mt-6">
      <h3 className="text-lg font-semibold mb-5">
        Công việc đã ứng tuyển
      </h3>

      {jobs.length === 0 ? (
        <p className="text-sm text-gray-500">
          Bạn chưa ứng tuyển công việc nào.
        </p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const status =
              statusMap[job.status] || {
                text: job.status,
                className: "text-gray-500 bg-gray-100",
              };

            return (
              <div
                key={job.id}
                className="border rounded-lg p-4 hover:shadow-sm transition"
              >
                {/* TOP */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Briefcase size={16} />
                      {job.job_title}
                    </h4>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Building2 size={15} />
                      {job.company_name}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <CalendarDays size={14} />
                      Ứng tuyển ngày{" "}
                      {new Date(job.applied_at).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${status.className}`}
                  >
                    {status.text}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-4 mt-4 text-sm">
                  {job.status === "pending" && (
                    <button
                      disabled={processingId === job.id}
                      onClick={() => handleCancel(job.id)}
                      className="flex items-center gap-1 text-red-600 hover:underline disabled:opacity-50"
                    >
                      <XCircle size={14} />
                      Hủy ứng tuyển
                    </button>
                  )}

                  {job.status === "cancelled" && (
                    <button
                      disabled={processingId === job.job_id}
                      onClick={() => handleReApply(job.job_id)}
                      className="flex items-center gap-1 text-blue-600 hover:underline disabled:opacity-50"
                    >
                      <RotateCcw size={14} />
                      Ứng tuyển lại
                    </button>
                  )}
                </div>

                {/* REJECT REASON */}
                {job.status === "rejected" &&
                  job.reject_reason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm">
                      <p className="font-medium text-red-600">
                        Lý do từ chối
                      </p>
                      <p className="text-red-700 mt-1">
                        {job.reject_reason}
                      </p>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AppliedJobList;
