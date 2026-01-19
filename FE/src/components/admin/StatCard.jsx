import {
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StatCard({
  title,
  value,
  highlight = false,
  trend, // optional: "+12%", "-5%"
  subtitle, // optional: "So với hôm qua"
  to, // ⭐ NEW: route khi click (optional)
}) {
  const navigate = useNavigate();
  const isNegative = trend?.startsWith("-");

  const clickable = Boolean(to);

  return (
    <div
      onClick={() => clickable && navigate(to)}
      className={`
        relative
        rounded-2xl
        border
        p-6
        overflow-hidden
        transition-all duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_18px_50px_rgba(0,0,0,0.15)]
        ${
          highlight
            ? "bg-gradient-to-br from-red-50 to-white border-red-200"
            : "bg-white border-gray-200"
        }
        ${
          clickable
            ? "cursor-pointer hover:ring-2 hover:ring-red-300/40"
            : ""
        }
      `}
    >
      {/* ===== SOFT GLOW (highlight only) ===== */}
      {highlight && (
        <div className="pointer-events-none absolute -top-12 -right-12 w-44 h-44 rounded-full bg-red-200/30 blur-3xl" />
      )}

      {/* ===== HEADER ===== */}
      <div className="flex items-start justify-between">
        <div>
          <p
            className={`
              text-sm font-medium
              ${highlight ? "text-red-600" : "text-gray-500"}
            `}
          >
            {title}
          </p>

          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`
            shrink-0
            rounded-xl p-2
            ${
              highlight
                ? "bg-red-100 text-red-600"
                : "bg-indigo-50 text-indigo-600"
            }
          `}
        >
          {isNegative ? (
            <TrendingDown className="w-4 h-4" />
          ) : (
            <TrendingUp className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* ===== VALUE ===== */}
      <div className="mt-4 flex items-end justify-between">
        <p
          className={`
            text-3xl font-bold tracking-tight
            ${highlight ? "text-red-700" : "text-gray-900"}
          `}
        >
          {value}
        </p>

        {/* ===== TREND ===== */}
        {trend && (
          <span
            className={`
              inline-flex items-center gap-1
              text-sm font-semibold
              ${
                isNegative
                  ? "text-red-600"
                  : "text-green-600"
              }
            `}
          >
            {trend}
          </span>
        )}
      </div>

      {/* ===== BOTTOM ACCENT ===== */}
      <div
        className={`
          absolute bottom-0 left-0 h-1 w-full
          ${
            highlight
              ? "bg-red-500/70"
              : "bg-indigo-500/40"
          }
        `}
      />
    </div>
  );
}
