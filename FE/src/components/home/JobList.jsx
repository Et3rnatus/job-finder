import JobCard from "../jobs/JobCard";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getJobs } from "../../services/jobService";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const keyword = searchParams.get("keyword") || "";
        const city = searchParams.get("city") || "";

        const data = await getJobs({ keyword, city });

        if (!Array.isArray(data)) {
          console.error("API getJobs trả sai định dạng:", data);
          setJobs([]);
          return;
        }

        const mappedJobs = data.map((job) => ({
          id: job.id,
          title: job.title,

          salary:
            job.min_salary != null && job.max_salary != null
              ? `${job.min_salary} - ${job.max_salary}`
              : "Thỏa thuận",

          location: job.location || "Chưa cập nhật",
          company: job.company_name || "Chưa cập nhật",

          // backend đã trả job_skill là string
          skills: job.job_skill || "",
        }));

        setJobs(mappedJobs);
      } catch (err) {
        console.error("Lỗi gọi getJobs:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams]); // 👈 rất quan trọng

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
        {loading && <p className="text-gray-500">Đang tải dữ liệu...</p>}

        {!loading && jobs.length > 0 &&
          jobs.map((job) => <JobCard key={job.id} {...job} />)}

        {!loading && jobs.length === 0 && (
          <p className="text-gray-500">Không tìm thấy công việc phù hợp.</p>
        )}
      </div>
    </section>
  );
}

export default JobList;
