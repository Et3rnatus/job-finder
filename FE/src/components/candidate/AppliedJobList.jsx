import { useEffect, useState } from "react";
import {
  getMyApplications,
  cancelApplication,
  applyJob,
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
  cancelled: {
    text: "Đã hủy ứng tuyển",
    className: "text-gray-400",
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
        ? data.filter((item) => item && item.id && item.job_id)
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
    const ok = window.confirm("Bạn có chắc muốn hủy ứng tuyển?");
    if (!ok) return;

    try {
      setProcessingId(applicationId);
      await cancelApplication(applicationId);
      fetchAppliedJobs();
    } catch (error) {
      alert("Hủy ứng tuyển thất bại");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReApply = async (jobId) => {
    const ok = window.confirm("Bạn có muốn ứng tuyển lại công việc này?");
    if (!ok) return;

    try {
      setProcessingId(jobId);
      await applyJob({ job_id: jobId }); // cover_letter optional
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
    return <div>Đang tải danh sách công việc đã ứng tuyển...</div>;
  }

  return (
    <div className="bg-white border rounded-lg p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">
        Công việc đã ứng tuyển
      </h3>

      {jobs.length === 0 ? (
        <p>Bạn chưa ứng tuyển công việc nào.</p>
      ) : (
        <>
          <div className="grid grid-cols-5 gap-4 text-sm font-medium border-b pb-2">
            <div>Công việc</div>
            <div>Công ty</div>
            <div>Ngày ứng tuyển</div>
            <div>Trạng thái</div>
            <div>Hành động</div>
          </div>

          <div className="divide-y">
            {jobs.map((job) => {
              const status =
                statusMap[job.status] || {
                  text: job.status,
                  className: "text-gray-500",
                };

              return (
                <div
                  key={job.id}
                  className="grid grid-cols-5 gap-4 py-3 text-sm"
                >
                  <div>{job.job_title}</div>
                  <div>{job.company_name}</div>
                  <div>
                    {new Date(job.applied_at).toLocaleDateString("vi-VN")}
                  </div>

                  <div className={status.className}>
                    {status.text}
                  </div>

                  <div className="space-y-1">
                    {job.status === "pending" && (
                      <button
                        disabled={processingId === job.id}
                        onClick={() => handleCancel(job.id)}
                        className="text-red-600 text-xs hover:underline disabled:opacity-50"
                      >
                        Hủy ứng tuyển
                      </button>
                    )}

                    {job.status === "cancelled" && (
                      <button
                        disabled={processingId === job.job_id}
                        onClick={() => handleReApply(job.job_id)}
                        className="text-blue-600 text-xs hover:underline disabled:opacity-50"
                      >
                        Ứng tuyển lại
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
