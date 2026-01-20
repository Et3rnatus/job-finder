import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  saveJob,
  unsaveJob,
} from "../../services/savedJobService";
import {
  MapPin,
  Wallet,
  Building2,
  ArrowRight,
  Loader2,
} from "lucide-react";

/* =====================
   HEART ICON
===================== */
const HeartIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={filled ? "currentColor" : "none"}
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5
         -1.935 0-3.597 1.126-4.312 2.733
         -.715-1.607-2.377-2.733-4.313-2.733
         C5.1 3.75 3 5.765 3 8.25
         c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
);

const API_URL = "http://127.0.0.1:3001";

function JobCard({
  id,
  title,

  /* 👉 SALARY (RAW DATA) */
  min_salary,
  max_salary,
  is_salary_negotiable,

  location,
  company,
  companyLogo,
  skills,
}) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  /* =====================
     SALARY FORMATTER
  ===================== */
  const toMillion = (value) => {
    if (!value || value <= 0) return null;
    return Math.round(value / 1_000_000);
  };

  const formatSalary = () => {
    if (Number(is_salary_negotiable) === 1) {
  return "Thỏa thuận";
}

    const min = toMillion(min_salary);
    const max = toMillion(max_salary);

    if (min && max) return `${min} – ${max} triệu`;
    if (min) return `Từ ${min} triệu`;
    if (max) return `Đến ${max} triệu`;

    return "Thỏa thuận";
  };

  /* =====================
     HANDLERS
  ===================== */
  const handleApply = (e) => {
    e.stopPropagation();
    navigate(`/jobs/${id}`);
  };

  const handleToggleSave = async (e) => {
    e.stopPropagation();
    if (saving) return;

    try {
      setSaving(true);
      if (saved) {
        await unsaveJob(id);
        setSaved(false);
      } else {
        await saveJob(id);
        setSaved(true);
      }
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Không thể lưu công việc"
      );
    } finally {
      setSaving(false);
    }
  };

  const skillList = skills ? skills.split(",") : [];

  /* =====================
     LOGO SRC
  ===================== */
  const logoSrc = companyLogo
    ? companyLogo.startsWith("http")
      ? companyLogo
      : `${API_URL}${companyLogo}`
    : "/default-company.png";

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Xem chi tiết công việc ${title}`}
      onClick={() => navigate(`/jobs/${id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          navigate(`/jobs/${id}`);
        }
      }}
      className="
        group relative
        bg-white border border-gray-200 rounded-2xl
        p-4 flex gap-4
        cursor-pointer overflow-hidden h-full

        transition-all duration-200 ease-out
        hover:border-emerald-600 hover:shadow-lg

        focus:outline-none
        focus:ring-2 focus:ring-emerald-500/40
        focus:ring-offset-2 focus:ring-offset-white
      "
    >
      {/* LEFT ACCENT */}
      <span className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600 opacity-0 group-hover:opacity-100 transition" />

      {/* LOGO */}
      <div className="w-12 h-12 flex-shrink-0">
        <img
          src={logoSrc}
          alt=""
          className="
            w-12 h-12 rounded-xl
            object-contain border border-gray-200 bg-white
          "
          onError={(e) => {
            e.currentTarget.src = "/default-company.png";
          }}
        />
      </div>

      {/* CONTENT */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* BADGES */}
        <div className="flex flex-wrap gap-2 mb-1">
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
            Mới
          </span>
        </div>

        {/* COMPANY */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate">{company}</span>
        </div>

        {/* TITLE */}
        <h3 className="
            text-sm font-semibold text-gray-900
            mt-1 leading-snug
            group-hover:text-emerald-600
            transition
            line-clamp-2
          ">
          {title}
        </h3>

        {/* META */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-2 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-emerald-600/80" />
            {formatSalary()}
          </span>

          {location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600/80" />
              {location}
            </span>
          )}
        </div>

        {/* SKILLS */}
        {skillList.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {skillList.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="
                  text-[11px] font-medium
                  bg-emerald-50 text-emerald-700
                  px-2.5 py-0.5 rounded-full
                "
              >
                {skill.trim()}
              </span>
            ))}
            {skillList.length > 3 && (
              <span className="text-[11px] text-slate-400">
                +{skillList.length - 3} kỹ năng
              </span>
            )}
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col items-end justify-between gap-2">
        {/* SAVE */}
        <button
          onClick={handleToggleSave}
          disabled={saving}
          aria-label={saved ? "Bỏ lưu công việc" : "Lưu công việc"}
          className={`
            w-10 h-10 flex items-center justify-center
            rounded-full border
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500/40
            ${
              saved
                ? "bg-emerald-600 border-emerald-600 text-white"
                : "border-gray-300 text-gray-500 hover:border-emerald-600 hover:text-emerald-600"
            }
            active:scale-95
            disabled:opacity-50
          `}
        >
          {saving ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <HeartIcon filled={saved} />
          )}
        </button>

        {/* APPLY */}
        <button
          onClick={handleApply}
          className="
            inline-flex items-center gap-1.5
            text-xs font-semibold
            px-4 py-1.5 rounded-full
            border border-emerald-600 text-emerald-600
            hover:bg-emerald-600 hover:text-white
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500/40
          "
        >
          Ứng tuyển nhanh
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}

export default JobCard;
