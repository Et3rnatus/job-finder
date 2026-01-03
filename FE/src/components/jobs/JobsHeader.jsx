import { useSearchParams } from "react-router-dom";

function JobsHeader() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      {/* ===== BREADCRUMB ===== */}
      <p className="text-xs text-gray-400 mb-2">
        Trang chủ
        <span className="mx-1">›</span>
        Việc làm
        {keyword && (
          <>
            <span className="mx-1">›</span>
            <span className="text-gray-600 font-medium">
              {keyword}
            </span>
          </>
        )}
      </p>

      {/* ===== TITLE ===== */}
      <h1 className="text-2xl font-semibold text-gray-900 leading-snug">
        Tuyển dụng việc làm{" "}
        <span className="text-green-600">
          {keyword || "mới nhất"}
        </span>
      </h1>

      {/* ===== SUBTITLE ===== */}
      <p className="text-sm text-gray-600 mt-2 max-w-2xl">
        Khám phá các cơ hội việc làm phù hợp với kỹ năng và
        định hướng nghề nghiệp của bạn
      </p>
    </div>
  );
}

export default JobsHeader;
