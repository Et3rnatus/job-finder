import { Globe, MapPin, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = "http://127.0.0.1:3001";

function JobSidebar({ job }) {
  if (!job) return null;

  /* =====================
     LOGO EMPLOYER
  ===================== */
  const logoSrc = job.logo
    ? job.logo.startsWith("http")
      ? job.logo
      : `${API_URL}${job.logo}`
    : null;

  return (
    <aside
      className="
        bg-white border border-gray-200
        rounded-3xl p-6
        shadow-sm
        space-y-8
      "
    >
      {/* =====================
          COMPANY HEADER
      ===================== */}
      <div className="flex items-center gap-4">
        {/* LOGO */}
        {logoSrc ? (
          <img
            src={logoSrc}
            alt=""
            className="
              w-14 h-14 object-contain
              border rounded-2xl bg-white
            "
            onError={(e) => {
              e.currentTarget.src = "/default-company.png";
            }}
          />
        ) : (
          <div
            className="
              w-14 h-14
              flex items-center justify-center
              rounded-2xl border
              bg-gray-50 text-gray-400
            "
          >
            <Building2 size={22} />
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
        <h4 className="text-sm font-semibold text-gray-900 mb-5">
          Thông tin công ty
        </h4>

        <div className="space-y-5 text-sm text-gray-700">
          {/* WEBSITE */}
          <div className="flex items-start gap-3">
            <div
              className="
                w-9 h-9 rounded-xl
                bg-emerald-50
                flex items-center justify-center
                flex-shrink-0
              "
            >
              <Globe className="w-4 h-4 text-emerald-600" />
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
                    text-emerald-600 hover:underline
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
                w-9 h-9 rounded-xl
                bg-emerald-50
                flex items-center justify-center
                flex-shrink-0
              "
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
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
        <div className="pt-6 border-t space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-5">
            {job.company_description}
          </p>

          <Link
            to={`/companies/${job.company_id}`}
            className="
              inline-flex items-center gap-1
              text-sm font-semibold
              text-emerald-600 hover:text-emerald-700
              transition
            "
          >
            Xem trang công ty
            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </aside>
  );
}

export default JobSidebar;
