function JobHeader({ job }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* JOB TITLE */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        {job.title}
      </h1>

      {/* COMPANY NAME */}
      <p className="text-gray-600 mb-4">
        {job.company?.name}
      </p>

      {/* META INFO */}
      <div className="flex flex-wrap gap-6 text-sm text-gray-700">
        <span>
          <strong>Địa điểm:</strong> {job.location}
        </span>

        <span>
          <strong>Mức lương:</strong>{" "}
          {job.min_salary} - {job.max_salary}
        </span>

        <span>
          <strong>Hình thức:</strong> Toàn thời gian
        </span>
      </div>
    </div>
  );
}

export default JobHeader;
