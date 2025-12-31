function JobHeader({ job }) {
  const salary =
    job.min_salary && job.max_salary
      ? `${job.min_salary} - ${job.max_salary}`
      : "Thỏa thuận";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* JOB TITLE */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        {job.title}
      </h1>

      {/* COMPANY NAME */}
      <p className="text-gray-600 mb-4">
        {job.company_name || "Chưa cập nhật tên công ty"}
      </p>

      {/* META INFO */}
      <div className="flex flex-wrap gap-6 text-sm text-gray-700">
        <span>
          <strong>Địa điểm:</strong>{" "}
          {job.location || "Chưa cập nhật"}
        </span>

        <span>
          <strong>Mức lương:</strong>{" "}
          {salary}
        </span>

        <span>
          <strong>Hình thức:</strong>{" "}
          {job.employment_type || "Chưa cập nhật"}
        </span>
      </div>
    </div>
  );
}

export default JobHeader;
