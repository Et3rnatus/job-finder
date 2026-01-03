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
  }, [searchParams]);

  return (
    <section className="bg-white border rounded-xl overflow-hidden">
      {/* HEADER */}
      <div className="px-6 py-5 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          Việc làm đang tuyển dụng
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {jobs.length > 0
            ? `Tìm thấy ${jobs.length} công việc phù hợp`
            : "Danh sách các công việc hiện có trên hệ thống"}
        </p>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {/* LOADING */}
        {loading && (
          <div className="py-10 text-center text-gray-500">
            Đang tải dữ liệu công việc...
          </div>
        )}

        {/* LIST */}
        {!loading && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && jobs.length === 0 && (
          <div className="py-16 text-center text-gray-500">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-medium mb-1">
              Không tìm thấy công việc phù hợp
            </p>
            <p className="text-sm">
              Hãy thử thay đổi từ khóa hoặc khu vực tìm kiếm
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default JobList;
