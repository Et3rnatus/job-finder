import { Globe, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

function JobSidebar({ job }) {
  return (
    <aside
      className="
        bg-white border border-gray-200
        rounded-2xl p-6
        shadow-sm
        space-y-7
      "
    >
      {/* =====================
          COMPANY HEADER
      ===================== */}
      <div className="flex items-center gap-4">
        {/* LOGO */}
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
          <div
            className="
              w-14 h-14
              flex items-center justify-center
              rounded-xl border
              bg-gray-50 text-gray-400
              text-xs font-semibold
              tracking-wide
            "
          >
            LOGO
          </div>
        )}

        {/* NAME */}
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {job.company_name || "Chưa cập nhật tên công ty"}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Nhà tuyển dụng
          </p>
        </div>
      </div>

      {/* =====================
          COMPANY INFO
      ===================== */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          Thông tin công ty
        </h4>

        <div className="space-y-5 text-sm text-gray-700">
          {/* WEBSITE */}
          <div className="flex items-start gap-3">
            <div
              className="
                w-8 h-8 rounded-lg
                bg-green-50
                flex items-center justify-center
                flex-shrink-0
              "
            >
              <Globe className="w-4 h-4 text-green-600" />
            </div>

            <div className="min-w-0">
              <p className="font-medium text-gray-800 mb-0.5">
                Website
              </p>

              {job.company_website ? (
                <a
                  href={job.company_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    text-green-600 hover:underline
                    break-all text-sm
                  "
                >
                  {job.company_website}
                </a>
              ) : (
                <p className="italic text-gray-400 text-sm">
                  Chưa cập nhật
                </p>
              )}
            </div>
          </div>

          {/* ADDRESS */}
          <div className="flex items-start gap-3">
            <div
              className="
                w-8 h-8 rounded-lg
                bg-green-50
                flex items-center justify-center
                flex-shrink-0
              "
            >
              <MapPin className="w-4 h-4 text-green-600" />
            </div>

            <div className="min-w-0">
              <p className="font-medium text-gray-800 mb-0.5">
                Địa chỉ
              </p>

              {job.company_address ? (
                <p className="text-sm leading-relaxed">
                  {job.company_address}
                </p>
              ) : (
                <p className="italic text-gray-400 text-sm">
                  Chưa cập nhật
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =====================
          COMPANY DESCRIPTION
      ===================== */}
      {job.company_description && (
        <div className="pt-5 border-t">
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-5">
            {job.company_description}
          </p>

          {/* VIEW COMPANY */}
          <div className="mt-4">
            <Link
              to={`/companies/${job.company_id}`}
              className="
                inline-flex items-center gap-1
                text-sm font-medium
                text-green-600 hover:text-green-700
                hover:underline
              "
            >
              Xem trang công ty
              <span className="text-base">→</span>
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}

export default JobSidebar;
