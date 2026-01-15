import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  saveJob,
  unsaveJob,
} from "../../services/savedJobService";
import { MapPin, Wallet, Building2 } from "lucide-react";

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

function JobCard({ id, title, salary, location, company, skills }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

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

  return (
    <div
      onClick={() => navigate(`/jobs/${id}`)}
      className="
        group relative
        bg-white border border-gray-200 rounded-2xl
        p-5 flex gap-5
        hover:border-green-600 hover:shadow-lg
        transition-all duration-200
        cursor-pointer
      "
    >
      {/* =====================
          CONTENT
      ===================== */}
      <div className="flex-1 min-w-0">
        {/* COMPANY */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Building2 className="w-3.5 h-3.5" />
          <span className="truncate">{company}</span>
        </div>

        {/* TITLE */}
        <h3
          className="
            text-base font-semibold text-gray-900
            mt-1 leading-snug
            group-hover:text-green-600
            transition
            line-clamp-2
          "
        >
          {title}
        </h3>

        {/* META */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-green-600" />
            {salary}
          </span>

          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-green-600" />
            {location}
          </span>
        </div>

        {/* SKILLS */}
        {skillList.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {skillList.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="
                  text-xs font-medium
                  bg-green-50 text-green-700
                  px-3 py-1 rounded-full
                "
              >
                {skill.trim()}
              </span>
            ))}

            {skillList.length > 3 && (
              <span className="text-xs text-gray-400">
                +{skillList.length - 3} kỹ năng
              </span>
            )}
          </div>
        )}
      </div>

      {/* =====================
          ACTIONS
      ===================== */}
      <div className="flex flex-col items-end justify-between gap-3">
        {/* SAVE */}
        <button
          onClick={handleToggleSave}
          disabled={saving}
          className={`
            w-11 h-11 flex items-center justify-center
            rounded-full border
            transition-all duration-200
            ${
              saved
                ? "bg-green-600 border-green-600 text-white"
                : "border-gray-300 text-gray-500 hover:border-green-600 hover:text-green-600"
            }
            active:scale-95
            disabled:opacity-50
          `}
          title={saved ? "Bỏ lưu công việc" : "Lưu công việc"}
        >
          <HeartIcon filled={saved} />
        </button>

        {/* APPLY */}
        <button
          onClick={handleApply}
          className="
            text-sm font-semibold
            px-5 py-2 rounded-full
            border border-green-600 text-green-600
            hover:bg-green-600 hover:text-white
            transition-all duration-200
          "
        >
          Ứng tuyển
        </button>
      </div>

      {/* =====================
          HOVER ACCENT
      ===================== */}
      <span
        className="
          absolute left-0 top-0 bottom-0
          w-1 rounded-l-2xl
          bg-green-600
          opacity-0 group-hover:opacity-100
          transition
        "
      />
    </div>
  );
}

export default JobCard;
