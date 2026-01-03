function JobHeader({ job }) {
  const salary =
    job.min_salary && job.max_salary
      ? `${job.min_salary} - ${job.max_salary}`
      : "Thỏa thuận";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      {/* ===== TITLE + COMPANY ===== */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 leading-snug">
          {job.title}
        </h1>

        <p className="text-gray-600 mt-1">
          {job.company_name || "Chưa cập nhật tên công ty"}
        </p>
      </div>

      {/* ===== META INFO ===== */}
      <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-700">
        {/* LOCATION */}
        <div className="flex items-center gap-2">
          <span className="text-green-600">
            📍
          </span>
          <span>
            <span className="font-medium">Địa điểm:</span>{" "}
            {job.location || "Chưa cập nhật"}
          </span>
        </div>

        {/* SALARY */}
        <div className="flex items-center gap-2">
          <span className="text-green-600">
            💰
          </span>
          <span>
            <span className="font-medium">Mức lương:</span>{" "}
            {salary}
          </span>
        </div>

        {/* EMPLOYMENT TYPE */}
        <div className="flex items-center gap-2">
          <span className="text-green-600">
            🕒
          </span>
          <span>
            <span className="font-medium">Hình thức:</span>{" "}
            {job.employment_type || "Chưa cập nhật"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default JobHeader;
