import JobCard from "../jobs/JobCard";
import { useEffect, useState } from "react";
import { getJobs } from "../../services/jobService";

function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getJobs()
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("API getJobs trả sai định dạng:", data);
          setJobs([]);
          return;
        }

        const mappedJobs = data.map((job) => ({
          id: job.id,
          title: job.title,
          salary:
            job.min_salary && job.max_salary
              ? `${job.min_salary} - ${job.max_salary}`
              : "Thỏa thuận",
          location: job.location,
          company: job.company_name || "Chưa cập nhật",
          skill: job.job_skill || "Chưa cập nhật",
        }));

        setJobs(mappedJobs);
      })
      .catch((err) => {
        console.error("Lỗi gọi getJobs:", err);
        setJobs([]);
      });
  }, []);

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-5 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          Danh sách công việc đang tuyển dụng
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Tất cả các công việc hiện có trên hệ thống
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.length > 0 ? (
          jobs.map((job) => <JobCard key={job.id} {...job} />)
        ) : (
          <p className="text-gray-500">Chưa có công việc nào.</p>
        )}
      </div>
    </section>
  );
}

export default JobList;
