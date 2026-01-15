import {
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
} from "lucide-react";

function JobHeader({ job }) {
  /* =====================
     FORMATTERS
  ===================== */
  const formatSalary = () => {
    if (job.is_salary_negotiable) return "Thỏa thuận";
    if (job.min_salary && job.max_salary) {
      return `${job.min_salary} – ${job.max_salary} triệu`;
    }
    return "Thỏa thuận";
  };

  const formatDeadline = () => {
    if (!job.expired_at) return null;
    return new Date(job.expired_at).toLocaleDateString("vi-VN");
  };

  const formatPostedDate = () => {
    if (!job.created_at) return null;

    const days = Math.floor(
      (Date.now() - new Date(job.created_at)) /
        (1000 * 60 * 60 * 24)
    );

    if (days <= 0) return "Hôm nay";
    if (days === 1) return "1 ngày trước";
    return `${days} ngày trước`;
  };

  const experienceLabelMap = {
    no_experience: "Không yêu cầu",
    under_1_year: "Dưới 1 năm",
    "1_year": "1 năm",
    "2_3_years": "2–3 năm",
    "3_5_years": "3–5 năm",
    over_5_years: "Trên 5 năm",
  };

  /* =====================
     LOCATION (CITY ONLY)
  ===================== */
  const getCityFromLocation = () => {
    if (!job.location) return null;
    const parts = job.location.split(",");
    return parts[parts.length - 1].trim();
  };

  return (
    <section
      className="
        bg-white border border-gray-200
        rounded-2xl p-6 md:p-8
        shadow-sm
      "
    >
      {/* =====================
          TOP SECTION
      ===================== */}
      <div className="flex flex-col gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
          {job.title}
        </h1>

        {/* META LINE */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
          {job.created_at && (
            <span>Đăng {formatPostedDate()}</span>
          )}

          {job.expired_at && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Hạn nộp:{" "}
              <span className="font-medium text-gray-700">
                {formatDeadline()}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* =====================
          INFO GRID
      ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* SALARY */}
        <InfoCard
          icon={DollarSign}
          label="Mức lương"
          value={formatSalary()}
          highlight
        />

        {/* LOCATION */}
        {job.location && (
          <InfoCard
            icon={MapPin}
            label="Địa điểm"
            value={getCityFromLocation()}
          />
        )}

        {/* EXPERIENCE */}
        {job.experience &&
          experienceLabelMap[job.experience] && (
            <InfoCard
              icon={Briefcase}
              label="Kinh nghiệm"
              value={experienceLabelMap[job.experience]}
            />
          )}

        {/* DEADLINE */}
        {job.expired_at && (
          <InfoCard
            icon={Clock}
            label="Hạn nộp"
            value={formatDeadline()}
          />
        )}
      </div>
    </section>
  );
}

/* =====================
   SUB COMPONENT
===================== */

function InfoCard({
  icon: Icon,
  label,
  value,
  highlight = false,
}) {
  return (
    <div
      className={`
        flex items-start gap-4
        p-4 rounded-xl border
        transition
        ${
          highlight
            ? "bg-green-50 border-green-200"
            : "bg-gray-50 border-gray-100 hover:bg-white hover:border-green-200"
        }
      `}
    >
      {/* ICON */}
      <div
        className={`
          w-10 h-10 rounded-lg
          flex items-center justify-center
          shrink-0
          ${
            highlight
              ? "bg-green-600 text-white"
              : "bg-green-100 text-green-600"
          }
        `}
      >
        <Icon size={18} />
      </div>

      {/* CONTENT */}
      <div>
        <p className="text-xs text-gray-500 mb-1">
          {label}
        </p>
        <p
          className={`
            text-sm font-semibold
            ${
              highlight
                ? "text-green-700"
                : "text-gray-800"
            }
          `}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default JobHeader;
