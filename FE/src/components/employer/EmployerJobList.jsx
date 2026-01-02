import { useEffect, useMemo, useState } from "react";
import employerService from "../../services/employerService";
import {
  getApplicantsByJob,
  updateApplicationStatus,
} from "../../services/applicationService";

const FILTERS = {
  ALL: "all",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

function EmployerJobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // filter
  const [filter, setFilter] = useState(FILTERS.ALL);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await employerService.getMyJobs();
        setJobs(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleViewApplicants = async (job) => {
    setSelectedJob(job);
    setShowModal(true);
    setLoadingApplicants(true);

    try {
      const data = await getApplicantsByJob(job.id);

      // sort pending first
      const sorted = [...(data || [])].sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return 0;
      });

      setApplicants(sorted);
    } catch (e) {
      console.error(e);
      setApplicants([]);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleApprove = async (id) => {
    await updateApplicationStatus(id, "approved");
    setApplicants((prev) =>
      prev.map((a) =>
        a.application_id === id ? { ...a, status: "approved" } : a
      )
    );
  };

  const handleReject = async (id) => {
    const reason = prompt("Nhập lý do từ chối (không bắt buộc):");

    await updateApplicationStatus(id, "rejected");

    setApplicants((prev) =>
      prev.map((a) =>
        a.application_id === id
          ? { ...a, status: "rejected", reject_reason: reason }
          : a
      )
    );
  };

  const filteredApplicants = useMemo(() => {
    if (filter === FILTERS.ALL) return applicants;
    return applicants.filter((a) => a.status === filter);
  }, [filter, applicants]);

  const closeModal = () => {
    setShowModal(false);
    setSelectedJob(null);
    setApplicants([]);
    setFilter(FILTERS.ALL);
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Việc làm đã đăng</h3>

      {loading && <p className="text-sm text-gray-500">Đang tải...</p>}

      {!loading &&
        jobs.map((job) => {
          const handled =
            (job.approved_count || 0) + (job.rejected_count || 0);

          return (
            <div
              key={job.id}
              className="border rounded-lg p-4 mb-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold flex gap-2 flex-wrap">
                    {job.title}

                    {job.pending_count > 0 && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 rounded">
                        🔔 Ứng viên mới ({job.pending_count})
                      </span>
                    )}

                    {job.pending_count === 0 && handled > 0 && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 rounded">
                        ✅ Đã xử lý ({handled})
                      </span>
                    )}
                  </h4>

                  <p className="text-sm text-gray-500">
                    👥 {job.total_applications || 0} • ⏳{" "}
                    {job.pending_count || 0} • ✅{" "}
                    {job.approved_count || 0} • ❌{" "}
                    {job.rejected_count || 0}
                  </p>
                </div>

                <button
                  className="px-4 py-2 bg-green-600 text-white rounded"
                  onClick={() => handleViewApplicants(job)}
                >
                  Xem ứng viên
                </button>
              </div>
            </div>
          );
        })}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl p-6">
            <h3 className="text-lg font-semibold mb-4">
              Ứng viên – {selectedJob?.title}
            </h3>

            <div className="flex gap-2 mb-4">
              {[
                ["Tất cả", FILTERS.ALL],
                ["⏳ Chờ duyệt", FILTERS.PENDING],
                ["✅ Đã duyệt", FILTERS.APPROVED],
                ["❌ Từ chối", FILTERS.REJECTED],
              ].map(([label, key]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1 rounded text-sm ${
                    filter === key
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {loadingApplicants && (
              <p className="text-sm text-gray-500">Đang tải...</p>
            )}

            {!loadingApplicants && filteredApplicants.length === 0 && (
              <p className="text-sm text-gray-500">Không có ứng viên</p>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredApplicants.map((app) => (
                <div
                  key={app.application_id}
                  className={`border rounded p-4 ${
                    app.status === "rejected"
                      ? "opacity-60 bg-gray-50"
                      : ""
                  }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{app.full_name}</p>
                      <p className="text-sm text-gray-500">
                        Ngày nộp:{" "}
                        {new Date(app.applied_at).toLocaleDateString("vi-VN")}
                      </p>

                      {app.status === "approved" && (
                        <p className="text-green-600 text-sm mt-1">
                          ✅ Đã chấp nhận
                        </p>
                      )}

                      {app.status === "rejected" && (
                        <div className="text-red-600 text-sm mt-1">
                          ❌ Đã từ chối
                          {app.reject_reason && (
                            <p className="italic text-gray-600">
                              Lý do: {app.reject_reason}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {app.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded"
                          onClick={() => handleApprove(app.application_id)}
                        >
                          Duyệt
                        </button>
                        <button
                          className="px-3 py-1 bg-red-600 text-white rounded"
                          onClick={() => handleReject(app.application_id)}
                        >
                          Từ chối
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-right">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={closeModal}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployerJobList;
