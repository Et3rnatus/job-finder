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

      // 3️⃣ OK → CHO APPLY (DEMO)
      alert("Hồ sơ hợp lệ – mở form ứng tuyển");

    } catch (error) {
      alert("Có lỗi xảy ra");
    }
  };

  if (!job) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="w-full bg-gray-100 py-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">

        {/* LEFT */}
        <div className="md:col-span-2">
          <JobHeader job={job} />

          <JobInfoSection title="Mô tả công việc" content={job.description} />
          <JobInfoSection title="Yêu cầu ứng viên" content={job.requirements} />
          <JobInfoSection title="Quyền lợi" content={job.benefits} />

          <ApplyButton onApply={handleApply} />
        </div>

        {/* RIGHT */}
        <div>
          <JobSidebar company={job.company} />
        </div>
      </div>
    </div>
  );
}

export default JobDetailPage;
