import {
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  CalendarDays,
  Sparkles,
} from "lucide-react";

function JobHeader({ job }) {
  if (!job) return null;

  /* =====================
     HELPERS
  ===================== */

  // VNĐ → triệu
  const toMillion = (value) => {
  if (!value || value <= 0) return null;
  return Math.floor(value / 1_000_000);
};



  const formatSalary = () => {
  if (job.is_salary_negotiable) return "Thỏa thuận";

  const min = Number(job.min_salary);
  const max = Number(job.max_salary);

  if (min > 0 && max > 0) {
    return `${toMillion(min)} – ${toMillion(max)} triệu`;
  }

  if (min > 0) {
    return `Từ ${toMillion(min)} triệu`;
  }

  if (max > 0) {
    return `Đến ${toMillion(max)} triệu`;
  }

  return "Đang cập nhật";
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
  const parts = job.location.split(",").map(p => p.trim()).filter(Boolean);
  return parts[parts.length - 1] || null;
};


  return (
    <section className="relative bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm overflow-hidden">
      {/* DECORATION */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />

      {/* =====================
          TOP
      ===================== */}
      <div className="relative flex flex-col gap-4 mb-8">
        {/* BADGE */}
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 w-fit">
          <Sparkles size={12} />
          Tuyển dụng nổi bật
        </span>

        {/* TITLE */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug">
          {job.title}
        </h1>

        {/* META */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
          {job.created_at && (
            <span className="flex items-center gap-1">
              <CalendarDays size={14} />
              Đăng {formatPostedDate()}
            </span>
          )}

          {job.expired_at && (
            <span className="flex items-center gap-1">
              <Clock size={14} />
              Hạn nộp:
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
        group
        flex items-start gap-4
        p-4 rounded-2xl border
        transition
        ${
          highlight
            ? "bg-emerald-50 border-emerald-200"
            : "bg-gray-50 border-gray-100 hover:bg-white hover:border-emerald-200"
        }
      `}
    >
      {/* ICON */}
      <div
        className={`
          w-11 h-11 rounded-xl
          flex items-center justify-center
          shrink-0
          transition
          ${
            highlight
              ? "bg-emerald-600 text-white"
              : "bg-emerald-100 text-emerald-600 group-hover:scale-105"
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
            text-sm font-semibold leading-snug
            ${
              highlight
                ? "text-emerald-700"
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
