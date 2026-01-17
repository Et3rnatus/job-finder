import JobCard from "../jobs/JobCard";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getJobs } from "../../services/jobService";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  SearchX,
} from "lucide-react";

const ITEMS_PER_PAGE = 6;

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setCurrentPage(1);

      try {
        const keyword = searchParams.get("keyword") || "";
        const city = searchParams.get("city") || "";

        const data = await getJobs({ keyword, city });

        if (!Array.isArray(data)) {
          setJobs([]);
          return;
        }

        setJobs(
          data.map((job) => ({
            id: job.id,
            title: job.title,
            salary:
              job.min_salary != null && job.max_salary != null
                ? `${job.min_salary} - ${job.max_salary}`
                : "Thỏa thuận",
            location: job.location || "Chưa cập nhật",
            company: job.company_name || "Chưa cập nhật",

            // LOGO COMPANY
            companyLogo: job.company_logo || null,

            skills: job.job_skill || "",
          }))
        );
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams]);

  const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE);

  const paginatedJobs = jobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
      {/* HEADER */}
      <div className="px-8 py-6 border-b bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Briefcase size={22} />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Việc làm đang tuyển dụng
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {jobs.length
                ? `Tìm thấy ${jobs.length} công việc phù hợp`
                : "Danh sách công việc hiện có trên hệ thống"}
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-8">
        {/* LOADING */}
        {loading && (
          <div className="py-32 flex flex-col items-center gap-4 text-gray-500">
            <Loader2 className="animate-spin text-emerald-500" size={30} />
            <span className="text-sm">
              Đang tải dữ liệu công việc...
            </span>
          </div>
        )}

        {/* JOB LIST */}
        {!loading && paginatedJobs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {paginatedJobs.map((job) => (
                <JobCard key={job.id} {...job} />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-16">
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={currentPage === 1}
                  className="w-11 h-11 rounded-full flex items-center justify-center border border-gray-300 hover:bg-gray-100 disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="text-sm text-gray-600">
                  Trang{" "}
                  <span className="font-semibold text-emerald-600">
                    {currentPage}
                  </span>{" "}
                  / {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(totalPages, p + 1)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="w-11 h-11 rounded-full flex items-center justify-center border border-gray-300 hover:bg-gray-100 disabled:opacity-40"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}

        {/* EMPTY STATE */}
        {!loading && jobs.length === 0 && (
          <div className="py-32 text-center text-gray-500">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <SearchX size={36} />
            </div>
            <p className="text-xl font-semibold mb-2 text-gray-700">
              Không tìm thấy công việc phù hợp
            </p>
            <p className="text-sm text-gray-500">
              Hãy thử thay đổi từ khóa hoặc khu vực tìm kiếm
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
