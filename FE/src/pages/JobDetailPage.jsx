import JobHeader from "../components/job_detail/JobHeader";
import JobInfoSection from "../components/job_detail/JobInfo";
import JobSidebar from "../components/job_detail/JobSidebar";
import ApplyButton from "../components/job_detail/ApplyButton";
import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import { getJobDetail } from "../services/jobService";

function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    getJobDetail(id).then(data => {
      setJob(data);
    });
  }, [id]);

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

          <ApplyButton onApply={() => alert("Ứng tuyển thành công!")} />
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