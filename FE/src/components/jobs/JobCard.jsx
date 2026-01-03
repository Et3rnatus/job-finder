import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  saveJob,
  unsaveJob,
} from "../../services/savedJobService";

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

  const handleApply = (e) => {
    e.stopPropagation();
    navigate(`/jobs/${id}`);
  };

  const handleToggleSave = async (e) => {
    e.stopPropagation();
    try {
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
    }
  };

  const skillList = skills ? skills.split(",") : [];

  return (
    <div
      onClick={() => navigate(`/jobs/${id}`)}
      className="
        bg-white border border-gray-200 rounded-2xl
        p-5 flex gap-5
        hover:border-green-600 hover:shadow-md
        transition cursor-pointer
      "
    >
      {/* ===== CONTENT ===== */}
      <div className="flex-1 min-w-0">
        {/* COMPANY */}
        <p className="text-xs text-gray-500 truncate">
          {company}
        </p>

        {/* TITLE */}
        <h3 className="text-base font-semibold text-gray-900 mt-1 leading-snug truncate">
          {title}
        </h3>

        {/* META */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            💰 {salary}
          </span>
          <span className="flex items-center gap-1">
            📍 {location}
          </span>
        </div>

        {/* SKILLS */}
        {skillList.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {skillList.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="
                  text-xs font-medium
                  bg-green-50 text-green-700
                  px-2.5 py-1 rounded-full
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

      {/* ===== ACTIONS ===== */}
      <div className="flex flex-col items-end justify-between gap-3">
        {/* SAVE */}
        <button
          onClick={handleToggleSave}
          className={`
            w-10 h-10 flex items-center justify-center
            rounded-full border transition
            ${
              saved
                ? "bg-green-600 border-green-600 text-white"
                : "border-gray-300 text-gray-500 hover:border-green-600 hover:text-green-600"
            }
            active:scale-95
          `}
          title={saved ? "Bỏ lưu công việc" : "Lưu công việc"}
        >
          <HeartIcon filled={saved} />
        </button>

        {/* APPLY */}
        <button
          onClick={handleApply}
          className="
            text-sm font-medium
            px-4 py-2 rounded-full
            border border-green-600 text-green-600
            hover:bg-green-600 hover:text-white
            transition
          "
        >
          Ứng tuyển
        </button>
      </div>
    </div>
  );
}

export default JobCard;
