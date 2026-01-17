import { useSearchParams } from "react-router-dom";
import { Search, Briefcase, Sparkles } from "lucide-react";

function JobsHeader() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  return (
    <section
      className="
        relative overflow-hidden
        bg-white border border-gray-200
        rounded-3xl
        p-6 md:p-8
        shadow-sm
      "
    >
      {/* =====================
          DECORATION
      ===================== */}
      <div className="absolute -top-28 -right-28 w-72 h-72 rounded-full bg-emerald-100/60 blur-2xl" />
      <div className="absolute top-1/2 -left-36 w-80 h-80 rounded-full bg-emerald-50 blur-2xl -translate-y-1/2" />

      {/* =====================
          CONTENT
      ===================== */}
      <div className="relative">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <span>Trang chủ</span>
          <span>›</span>
          <span>Việc làm</span>
          {keyword && (
            <>
              <span>›</span>
              <span className="text-gray-600 font-medium truncate max-w-[180px]">
                {keyword}
              </span>
            </>
          )}
        </div>

        {/* TITLE */}
        <div className="flex items-start gap-4">
          <div
            className="
              w-12 h-12 flex items-center justify-center
              rounded-2xl bg-emerald-100 text-emerald-600
              flex-shrink-0
            "
          >
            <Briefcase className="w-6 h-6" />
          </div>

          <div className="min-w-0">
            {/* BADGE */}
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 mb-2">
              <Sparkles size={12} />
              Cơ hội nghề nghiệp
            </span>

            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
              Tuyển dụng{" "}
              <span className="text-emerald-600">
                {keyword || "việc làm mới nhất"}
              </span>
            </h1>

            <p className="text-sm text-gray-600 mt-3 max-w-2xl leading-relaxed">
              Khám phá các cơ hội việc làm phù hợp với kỹ năng,
              kinh nghiệm và định hướng nghề nghiệp của bạn
            </p>
          </div>
        </div>

        {/* HINT */}
        <div className="flex items-center gap-2 mt-6 text-sm text-gray-500">
          <Search className="w-4 h-4 text-emerald-600" />
          <span>
            {keyword
              ? `Kết quả tìm kiếm theo từ khóa “${keyword}”`
              : "Hiển thị các công việc đang tuyển dụng trên hệ thống"}
          </span>
        </div>
      </div>
    </section>
  );
}

export default JobsHeader;
