import JobCard from "../jobs/JobCard";
import JobSkeleton from "../jobs/JobSkeleton";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getJobs } from "../../services/jobService";
import {
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
        const location = searchParams.get("location") || "";

        const data = await getJobs({ keyword, location });

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
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      {/* ================= HEADER ================= */}
      <div className="px-6 py-4 border-b bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Briefcase size={16} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Việc làm đang tuyển dụng
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {jobs.length
                ? `${jobs.length} công việc phù hợp`
                : "Danh sách công việc hiện có"}
            </p>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-6">
        {/* LOADING → SKELETON */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <JobSkeleton key={i} />
            ))}
          </div>
        )}

        {/* JOB LIST */}
        {!loading && paginatedJobs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedJobs.map((job) => (
                <JobCard key={job.id} {...job} />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-300 hover:bg-slate-100 disabled:opacity-40"
                >
                  <ChevronLeft size={14} />
                </button>

                <span className="text-xs text-slate-500">
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
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-300 hover:bg-slate-100 disabled:opacity-40"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}

        {/* EMPTY STATE */}
        {!loading && jobs.length === 0 && (
          <div className="py-20 text-center text-slate-500">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <SearchX size={26} />
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Không tìm thấy công việc phù hợp
            </p>
            <p className="text-xs text-slate-500">
              Hãy thử thay đổi từ khóa hoặc khu vực tìm kiếm
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
