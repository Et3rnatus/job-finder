
import JobHeader from "../components/job_detail/JobHeader";
import JobInfoSection from "../components/job_detail/JobInfo";
import JobSidebar from "../components/job_detail/JobSidebar";
import ApplyButton from "../components/job_detail/ApplyButton";
function JobDetailPage() {
  // data để test UI
  const job = {
    title: "Frontend Developer",
    company: "Tech Corp",
    location: "Hồ Chí Minh",
    salary: "20 - 25 triệu",
    description: `- Build UI bằng ReactJS
- Tối ưu hiệu suất
- Phối hợp với backend`,
    requirements: `- 1+ năm kinh nghiệm
- Biết ReactJS, Tailwind
- Biết Git`,
    benefits: `- Lương tháng 13
- Thưởng dự án
- Bảo hiểm đầy đủ`,
  };

  const company = {
    name: "Tech Corp",
    website: "https://techcorp.com",
    size: "100-500 nhân viên",
    address: "Quận 1, TP.HCM",
    logo:
      "https://i.pinimg.com/564x/ee/a3/4b/eea34b8bb57130a062b842b887149cf1.jpg",
  };

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
          <JobSidebar company={company} />
        </div>
      </div>
    </div>
  );
}
export default JobDetailPage;