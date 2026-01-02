import { useEffect, useState } from "react";
import employerService from "../../services/employerService";
import {
  getApplicantsByJob,
  updateApplicationStatus,
} from "../../services/applicationService";

function EmployerJobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await employerService.getMyJobs();
        setJobs(data);
      } catch (error) {
        console.error("GET EMPLOYER JOBS ERROR:", error);
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
      setApplicants(data);
    } catch (error) {
      console.error("GET APPLICANTS ERROR:", error);
      setApplicants([]);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      await updateApplicationStatus(applicationId, status);

      // update UI ngay
      setApplicants((prev) =>
        prev.map((app) =>
          app.application_id === applicationId
            ? { ...app, status }
            : app
        )
      );
    } catch (error) {
      console.error("UPDATE STATUS ERROR:", error);
      alert("Cập nhật trạng thái thất bại");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedJob(null);
    setApplicants([]);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Việc làm đã đăng
      </h3>

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-gray-500">Đang tải danh sách công việc...</p>
      )}

      {/* KHÔNG CÓ JOB */}
      {!loading && jobs.length === 0 && (
        <p className="text-sm text-gray-500">
          Bạn chưa đăng công việc nào.
        </p>
      )}

      {/* CÓ JOB */}
      {!loading && jobs.length > 0 && (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              {/* LEFT */}
              <div>
                <h4 className="font-semibold text-gray-800">{job.title}</h4>
                <p className="text-sm text-gray-500">
                  Ngày đăng:{" "}
                  {job.created_at
                    ? new Date(job.created_at).toLocaleDateString()
                    : "-"}
                  {" • "}
                  Hạn nộp:{" "}
                  {job.expired_at
                    ? new Date(job.expired_at).toLocaleDateString()
                    : "Không giới hạn"}
                </p>
              </div>

              {/* RIGHT */}
              <div className="mt-3 md:mt-0 flex items-center gap-4">
                <div className="text-sm text-gray-600 flex gap-3 flex-wrap">
                  <span>👥 {job.total_applications || 0}</span>
                  <span>⏳ {job.pending_count || 0}</span>
                  <span>✅ {job.approved_count || 0}</span>
                  <span>❌ {job.rejected_count || 0}</span>
                </div>
                <button
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => handleViewApplicants(job)}
                >
                  Xem ứng viên
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL ỨNG VIÊN ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl p-6 relative">
            <h3 className="text-lg font-semibold mb-4">
              Ứng viên ứng tuyển – {selectedJob?.title}
            </h3>

            {/* LOADING */}
            {loadingApplicants && (
              <p className="text-sm text-gray-500">
                Đang tải danh sách ứng viên...
              </p>
            )}

            {/* KHÔNG CÓ ỨNG VIÊN */}
            {!loadingApplicants && applicants.length === 0 && (
              <p className="text-sm text-gray-500">
                Chưa có ứng viên nào ứng tuyển.
              </p>
            )}

            {/* DANH SÁCH ỨNG VIÊN */}
            {!loadingApplicants && applicants.length > 0 && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {applicants.map((app) => (
                  <div
                    key={app.application_id}
                    className="border border-gray-200 rounded p-4"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{app.full_name}</p>
                        <p className="text-sm text-gray-500">
                          📞 {app.contact_number || "Chưa cập nhật"}
                        </p>
                        <p className="text-sm text-gray-500">
                          📍 {app.address || "Chưa cập nhật"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Ngày nộp:{" "}
                          {new Date(app.applied_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="text-sm px-3 py-1 rounded bg-gray-100">
                          {app.status}
                        </span>

                        {app.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                              onClick={() =>
                                handleUpdateStatus(
                                  app.application_id,
                                  "approved"
                                )
                              }
                            >
                              Duyệt
                            </button>
                            <button
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                              onClick={() =>
                                handleUpdateStatus(
                                  app.application_id,
                                  "rejected"
                                )
                              }
                            >
                              Từ chối
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {app.cover_letter && (
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Thư ứng tuyển:</strong> {app.cover_letter}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* CLOSE */}
            <div className="mt-6 text-right">
              <button
                className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
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
