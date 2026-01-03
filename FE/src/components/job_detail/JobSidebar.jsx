function JobSidebar({ job }) {
  return (
    <aside className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      {/* ===== COMPANY HEADER ===== */}
      <div className="flex items-center gap-4 mb-6">
        {job.company_logo ? (
          <img
            src={job.company_logo}
            alt="Company logo"
            className="
              w-14 h-14 object-contain
              border rounded-xl bg-white
            "
          />
        ) : (
          <div className="
            w-14 h-14 flex items-center justify-center
            rounded-xl border bg-gray-100
            text-gray-400 text-xs font-medium
          ">
            LOGO
          </div>
        )}

        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {job.company_name || "Chưa cập nhật tên công ty"}
          </h3>
          <p className="text-sm text-gray-500">
            Nhà tuyển dụng
          </p>
        </div>
      </div>

      {/* ===== COMPANY INFO ===== */}
      <div className="space-y-4 text-sm text-gray-700">
        {/* WEBSITE */}
        <div className="flex items-start gap-3">
          <span className="text-green-600 mt-0.5">🌐</span>
          <div>
            <p className="font-medium text-gray-800">
              Website
            </p>
            {job.company_website ? (
              <a
                href={job.company_website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline break-all"
              >
                {job.company_website}
              </a>
            ) : (
              <p className="italic text-gray-400">
                Chưa cập nhật
              </p>
            )}
          </div>
        </div>

        {/* ADDRESS */}
        <div className="flex items-start gap-3">
          <span className="text-green-600 mt-0.5">📍</span>
          <div>
            <p className="font-medium text-gray-800">
              Địa chỉ
            </p>
            {job.company_address ? (
              <p>{job.company_address}</p>
            ) : (
              <p className="italic text-gray-400">
                Chưa cập nhật
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ===== COMPANY DESCRIPTION ===== */}
      {job.company_description && (
        <div className="mt-6 pt-4 border-t">
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-5">
            {job.company_description}
          </p>
        </div>
      )}
    </aside>
  );
}

export default JobSidebar;
