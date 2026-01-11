import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";

import JobHeader from "../components/job_detail/JobHeader";
import JobInfoSection from "../components/job_detail/JobInfo";
import JobSidebar from "../components/job_detail/JobSidebar";
import ApplyButton from "../components/job_detail/ApplyButton";
import JobGeneralInfo from "../components/job_detail/JobGeneralInfo";
import ApplyForm from "../components/job_detail/ApplyForm";

import { getJobDetail } from "../services/jobService";
import { getMyApplications } from "../services/applicationService";

function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 🔑 Nguồn điều hướng (job list / saved / viewed…)
  const from = location.state?.from;

  const [job, setJob] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);

  /* =====================
     HELPERS
  ===================== */
  const isJobExpired = (expiredAt) => {
    if (!expiredAt) return false;
    return new Date(expiredAt) < new Date();
  };

  /* =====================
     SAVE VIEWED JOB
  ===================== */
  const saveViewedJob = (job) => {
    const KEY = "viewed_jobs";
    const MAX = 20;

    const stored = JSON.parse(
      localStorage.getItem(KEY) || "[]"
    );

    // bỏ trùng job
    const filtered = stored.filter(
      (j) => String(j.id) !== String(job.id)
    );

    const updated = [
      {
        id: job.id,
        title: job.title,
        company: job.company_name,
        location: job.location,
        viewedAt: new Date().toISOString(),
      },
      ...filtered,
    ].slice(0, MAX);

    localStorage.setItem(KEY, JSON.stringify(updated));
  };

  /* =====================
     LOAD JOB DETAIL
  ===================== */
  useEffect(() => {
    const loadJob = async () => {
      try {
        const data = await getJobDetail(id);
        setJob(data);

        // 👀 lưu lịch sử xem
        saveViewedJob(data);
      } catch (err) {
        console.error("LOAD JOB DETAIL ERROR:", err);
      }
    };

    loadJob();
  }, [id]);

  /* =====================
     LOAD APPLY STATUS
  ===================== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "candidate") return;

    const loadStatus = async () => {
      try {
        const apps = await getMyApplications();
        const found = apps.find(
          (a) => String(a.job_id) === String(id)
        );
        setApplicationStatus(found?.status || null);
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
     APPLY BUTTON CLICK
  ===================== */
  const handleApplyClick = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login", {
        state: { from: `/jobs/${id}` },
      });
      return;
    }

    if (role !== "candidate") {
      alert("Chỉ ứng viên mới có thể ứng tuyển");
      return;
    }

    if (isJobExpired(job.expired_at)) {
      alert("Công việc đã hết hạn");
      return;
    }

    setShowApplyForm(true);
  };

  /* =====================
     BACK BUTTON
  ===================== */
  const handleBack = () => {
    if (from) {
      navigate(from);
    } else {
      navigate("/jobs");
    }
  };

  /* =====================
     GUARD
  ===================== */
  if (!job) {
    return (
      <div className="text-center py-20 text-gray-500">
        Đang tải thông tin công việc...
      </div>
    );
  }

  const expired = isJobExpired(job.expired_at);
  const applied = ["pending", "approved", "rejected"].includes(
    applicationStatus
  );

  const buttonText = expired
    ? "Đã hết hạn ứng tuyển"
    : applicationStatus === "pending"
    ? "Đã ứng tuyển"
    : applicationStatus === "approved"
    ? "Đã được chấp nhận"
    : applicationStatus === "rejected"
    ? "Đã bị từ chối"
    : "Ứng tuyển ngay";

  return (
    <>
      <div className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">

          {/* ===== BACK BUTTON ===== */}
          <button
            onClick={handleBack}
            className="
              mb-4
              px-3 py-1.5
              text-sm text-gray-600
              border rounded-lg
              hover:bg-gray-100
            "
          >
            ← Quay lại
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ===== LEFT CONTENT ===== */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border p-6">
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
                content={job.skills?.map((s) => s.name)}
                isList
              />

              <JobInfoSection
                title="Quyền lợi"
                content={job.benefits}
              />
            </div>

            {/* ===== RIGHT SIDEBAR ===== */}
            <div className="space-y-6 sticky top-6 h-fit">
              <div className="bg-white border rounded-xl p-6 space-y-3">
                <ApplyButton
                  applied={applied}
                  disabled={expired || applied}
                  onApply={handleApplyClick}
                  buttonText={buttonText}
                />

                {expired && (
                  <p className="text-xs text-red-500">
                    Hạn nộp hồ sơ đã kết thúc
                  </p>
                )}
              </div>

              <JobSidebar job={job} />
              <JobGeneralInfo job={job} />
            </div>
          </div>
        </div>
      </div>

      {/* ===== APPLY FORM MODAL ===== */}
      {showApplyForm && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          onClick={() => setShowApplyForm(false)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <ApplyForm
              jobId={job.id}
              jobTitle={job.title}
              onClose={() => setShowApplyForm(false)}
              onSuccess={() => {
                setApplicationStatus("pending");
                setShowApplyForm(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default JobDetailPage;
