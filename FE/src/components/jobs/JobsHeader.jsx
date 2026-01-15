import { useSearchParams } from "react-router-dom";
import { Search, Briefcase } from "lucide-react";

function JobsHeader() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  return (
    <div
      className="
        relative overflow-hidden
        bg-white border border-gray-200 rounded-2xl
        p-6 md:p-8 shadow-sm
      "
    >
      {/* =====================
          DECORATION
      ===================== */}
      <div
        className="
          absolute -top-24 -right-24
          w-64 h-64 rounded-full
          bg-green-50
        "
      />
      <div
        className="
          absolute top-1/2 -left-32
          w-72 h-72 rounded-full
          bg-green-50
          -translate-y-1/2
        "
      />

      {/* =====================
          CONTENT
      ===================== */}
      <div className="relative">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <span>Trang chủ</span>
          <span>›</span>
          <span>Việc làm</span>
          {keyword && (
            <>
              <span>›</span>
              <span className="text-gray-600 font-medium truncate max-w-[160px]">
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
              rounded-xl bg-green-100 text-green-600
              flex-shrink-0
            "
          >
            <Briefcase className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              Tuyển dụng{" "}
              <span className="text-green-600">
                {keyword || "việc làm mới nhất"}
              </span>
            </h1>

            <p className="text-sm text-gray-600 mt-2 max-w-2xl">
              Khám phá các cơ hội việc làm phù hợp với kỹ năng,
              kinh nghiệm và định hướng nghề nghiệp của bạn
            </p>
          </div>
        </div>

        {/* HINT */}
        <div className="flex items-center gap-2 mt-5 text-sm text-gray-500">
          <Search className="w-4 h-4" />
          <span>
            {keyword
              ? `Kết quả tìm kiếm theo từ khóa “${keyword}”`
              : "Hiển thị các công việc đang tuyển dụng trên hệ thống"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default JobsHeader;
