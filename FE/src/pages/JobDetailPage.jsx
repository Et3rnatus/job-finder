import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JobHeader from "../components/job_detail/JobHeader";
import JobInfoSection from "../components/job_detail/JobInfo";
import JobSidebar from "../components/job_detail/JobSidebar";
import ApplyButton from "../components/job_detail/ApplyButton";
import { getJobDetail } from "../services/jobService";
import { applyJob, getMyApplications} from "../services/applicationService";

function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [loadingApply, setLoadingApply] = useState(false);

  /* =====================
     HELPERS
  ===================== */
  const isJobExpired = (expiredAt) => {
    if (!expiredAt) return false;
    return new Date(expiredAt) < new Date();
  };

  /* =====================
     LOAD JOB DETAIL
  ===================== */
  useEffect(() => {
    const loadJob = async () => {
      try {
        const jobData = await getJobDetail(id);
        setJob(jobData);
      } catch (err) {
        console.error("LOAD JOB DETAIL ERROR:", err);
      }
    };

    loadJob();
  }, [id]);

  /* =====================
     LOAD APPLICATION STATUS
  ===================== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "candidate") return;

    const loadStatus = async () => {
      try {
        const apps = await getMyApplications();
        const app = apps.find(
          (a) => String(a.job_id) === String(id)
        );
        setApplicationStatus(app ? app.status : null);
      } catch (e) {
        console.error(
          "LOAD APPLICATION STATUS ERROR:",
          e
        );
      }
    };

    loadStatus();
  }, [id]);

  /* =====================
     APPLY
  ===================== */
  const handleApply = async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      alert("Vui lòng đăng nhập để ứng tuyển");
      navigate("/login");
      return;
    }

    if (role !== "candidate") {
      alert("Chỉ ứng viên mới có thể ứng tuyển");
      return;
    }

    if (isJobExpired(job.expired_at)) {
      alert("Công việc này đã hết hạn tuyển dụng");
      return;
    }

    try {
      setLoadingApply(true);

      await applyJob({
        job_id: job.id,
        cover_letter: null,
      });

      alert("Ứng tuyển thành công");
      setApplicationStatus("pending");
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Ứng tuyển thất bại"
      );
    } finally {
      setLoadingApply(false);
    }
  };

  /* =====================
     GUARD
  ===================== */
  if (!job) {
    return (
      <div className="text-center py-16 text-gray-500">
        Đang tải dữ liệu công việc...
      </div>
    );
  }

  const expired = isJobExpired(job.expired_at);

  const isLocked =
    applicationStatus === "pending" ||
    applicationStatus === "approved" ||
    applicationStatus === "rejected";

  const buttonText = expired
    ? "Đã hết hạn ứng tuyển"
    : applicationStatus === "pending"
    ? "Đã ứng tuyển"
    : applicationStatus === "approved"
    ? "Đã được chấp nhận"
    : applicationStatus === "rejected"
    ? "Đã bị từ chối"
    : loadingApply
    ? "Đang xử lý..."
    : "Ứng tuyển ngay";

  return (
    <div className="bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* =====================
            MAIN CONTENT
        ===================== */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border rounded-xl p-6">
            <JobHeader job={job} />
          </div>

          <JobInfoSection
            title="Mô tả công việc"
            content={job.description}
          />

          <JobInfoSection
            title="Yêu cầu ứng viên"
            content={job.job_requirements}
          />

          <JobInfoSection
            title="Kỹ năng yêu cầu"
            content={job.skills?.map((s) => s.name) || []}
          />

          <JobInfoSection
            title="Quyền lợi"
            content={job.benefits}
          />
        </div>

        {/* =====================
            SIDEBAR
        ===================== */}
        <div className="space-y-6 md:sticky md:top-6 h-fit">
          {/* APPLY BOX */}
          <div className="bg-white border rounded-xl p-6 space-y-3">
            <ApplyButton
              job={job}
              applied={isLocked}
              disabled={expired || loadingApply}
              onApply={handleApply}
              buttonText={buttonText}
            />

            {expired && (
              <p className="text-xs text-red-500 mt-2">
                Tin tuyển dụng đã hết hạn
              </p>
            )}
          </div>

          <JobSidebar job={job} />
        </div>
      </div>
    </div>
  );
}

export default JobDetailPage;
