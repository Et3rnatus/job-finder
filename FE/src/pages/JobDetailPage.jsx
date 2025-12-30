import JobHeader from "../components/job_detail/JobHeader";
import JobInfoSection from "../components/job_detail/JobInfo";
import JobSidebar from "../components/job_detail/JobSidebar";
import ApplyButton from "../components/job_detail/ApplyButton";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobDetail } from "../services/jobService";

function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    getJobDetail(id).then((data) => {
      setJob(data);
    });
  }, [id]);

  const handleApply = async () => {
    const token = localStorage.getItem("token");

    // 1️⃣ CHƯA ĐĂNG NHẬP
    if (!token) {
      alert("Vui lòng đăng nhập để ứng tuyển");
      navigate("/login");
      return;
    }

    try {
      // 2️⃣ CHECK PROFILE
      const res = await fetch(
        "http://127.0.0.1:3001/api/candidates/check-profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!data.completed) {
        alert("Vui lòng cập nhật hồ sơ cá nhân trước khi ứng tuyển");
        navigate("/profile");
        return;
      }

      // 3️⃣ APPLY THÀNH CÔNG (DEMO)
      setApplied(true);
      alert("Ứng tuyển thành công");
    } catch (error) {
      alert("Có lỗi xảy ra");
    }
  };

  if (!job) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="w-full bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">

        {/* LEFT CONTENT */}
        <div className="md:col-span-2 space-y-6">
          <JobHeader job={job} />

          <JobInfoSection
            title="Mô tả công việc"
            content={job.description}
          />

          <JobInfoSection
            title="Yêu cầu ứng viên"
            content={job.requirements}
          />

          <JobInfoSection
            title="Kỹ năng yêu cầu"
            content={job.job_skill}
          />

          <JobInfoSection
            title="Quyền lợi"
            content={job.benefits}
          />
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">

          {/* APPLY BOX */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <ApplyButton
              onApply={handleApply}
              disabled={applied}
              text={applied ? "Đã ứng tuyển" : "Ứng tuyển"}
            />
            <p className="text-xs text-gray-500 mt-3">
              Ứng viên cần hoàn thiện hồ sơ trước khi ứng tuyển
            </p>
          </div>

          {/* COMPANY INFO */}
          <JobSidebar company={job.company} />
        </div>
      </div>
    </div>
  );
}

export default JobDetailPage;
