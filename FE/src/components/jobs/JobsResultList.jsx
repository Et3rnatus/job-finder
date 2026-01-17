import JobList from "../home/JobList";
import { Loader2, SearchX } from "lucide-react";

function JobsResultList({ jobs = [], loading }) {
  return (
    <section className="space-y-6">
      <div
        className="
          relative
          bg-white
          border border-gray-200
          rounded-3xl
          shadow-sm
          overflow-hidden
        "
      >
        {/* ACCENT BAR */}
        <span className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600" />

        {/* CONTENT */}
        <div className="p-5 md:p-6">
          {/* LOADING */}
          {loading && (
            <div className="py-20 flex flex-col items-center gap-4 text-gray-500">
              <Loader2 className="animate-spin text-emerald-600" size={28} />
              <span className="text-sm">
                Đang tải danh sách công việc...
              </span>
            </div>
          )}

          {/* EMPTY */}
          {!loading && jobs.length === 0 && (
            <div className="py-24 flex flex-col items-center text-center text-gray-500">
              <div className="w-16 h-16 mb-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <SearchX size={28} />
              </div>

              <p className="text-lg font-semibold text-gray-700 mb-2">
                Không tìm thấy công việc phù hợp
              </p>
              <p className="text-sm text-gray-500 max-w-md">
                Hãy thử thay đổi từ khóa tìm kiếm, khu vực
                hoặc bộ lọc để có kết quả tốt hơn
              </p>
            </div>
          )}

          {/* RESULT */}
          {!loading && jobs.length > 0 && (
            <JobList jobs={jobs} />
          )}
        </div>
      </div>
    </section>
  );
}

export default JobsResultList;
