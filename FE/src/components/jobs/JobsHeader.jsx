import { useSearchParams } from "react-router-dom";

function JobsHeader() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  return (
    <div className="bg-white p-4 rounded-lg border">
      <p className="text-sm text-gray-500">
        Trang chủ &gt; Việc làm {keyword && `> ${keyword}`}
      </p>

      <h1 className="text-xl font-semibold mt-1">
        Tuyển dụng việc làm {keyword || "mới nhất"}
      </h1>

      <p className="text-sm text-gray-600 mt-1">
        Các công việc phù hợp với nhu cầu của bạn
      </p>
    </div>
  );
}

export default JobsHeader;
