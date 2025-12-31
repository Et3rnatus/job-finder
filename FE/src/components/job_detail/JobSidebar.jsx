function JobSidebar({ job }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* COMPANY HEADER */}
      <div className="flex items-center gap-4 mb-5">
        {job.company_logo ? (
          <img
            src={job.company_logo}
            alt="logo"
            className="w-12 h-12 object-contain border rounded"
          />
        ) : (
          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 border rounded text-gray-400 text-xs">
            LOGO
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {job.company_name || "Chưa cập nhật tên công ty"}
          </h3>
          <p className="text-sm text-gray-600">
            Nhà tuyển dụng
          </p>
        </div>
      </div>

      {/* COMPANY INFO */}
      <div className="text-sm text-gray-700 space-y-2">
        <p>
          <strong>Website:</strong>{" "}
          {job.company_website ? (
            <a
              href={job.company_website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              {job.company_website}
            </a>
          ) : (
            <span className="italic text-gray-400">
              Chưa cập nhật
            </span>
          )}
        </p>

        <p>
          <strong>Địa chỉ:</strong>{" "}
          {job.company_address || (
            <span className="italic text-gray-400">
              Chưa cập nhật
            </span>
          )}
        </p>

        {job.company_description && (
          <div className="pt-3 border-t mt-3">
            <p className="text-sm text-gray-600">
              {job.company_description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobSidebar;
