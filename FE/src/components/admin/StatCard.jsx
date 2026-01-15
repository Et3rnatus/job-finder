import { TrendingUp } from "lucide-react";

export default function StatCard({
  title,
  value,
  highlight = false,
  trend, // optional: "+12%", "-5%"
  subtitle, // optional: "So với hôm qua"
}) {
  return (
    <div
      className={`
        relative
        rounded-2xl
        border
        p-6
        overflow-hidden
        transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-xl
        ${
          highlight
            ? "bg-gradient-to-br from-red-50 to-white border-red-200"
            : "bg-white border-gray-200"
        }
      `}
    >
      {/* ===== SOFT GLOW (highlight only) ===== */}
      {highlight && (
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-200/30 rounded-full blur-3xl pointer-events-none" />
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
          <TrendingUp className="w-4 h-4" />
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
              text-sm font-semibold
              ${
                trend.startsWith("-")
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
