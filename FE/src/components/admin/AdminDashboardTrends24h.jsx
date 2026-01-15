import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Clock } from "lucide-react";

/* =====================
   FORMATTERS
===================== */
// format HH:mm
const formatHour = (value) => {
  const date = new Date(value);
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* =====================
   EMPTY STATE
===================== */
function EmptyState() {
  return (
    <div className="h-[320px] flex flex-col items-center justify-center text-gray-400">
      <Clock className="w-10 h-10 mb-3 opacity-40" />
      <p className="text-sm font-medium">
        Chưa có dữ liệu 24 giờ gần nhất
      </p>
      <p className="text-xs mt-1">
        Biểu đồ sẽ cập nhật khi có hoạt động mới
      </p>
    </div>
  );
}

export default function AdminDashboardTrends24h({ data = [] }) {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div
      className="
        mt-8
        rounded-2xl
        bg-white
        border border-gray-200
        p-6
        shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        transition-all
        hover:shadow-[0_14px_45px_rgba(0,0,0,0.12)]
      "
    >
      {/* =====================
          HEADER
      ===================== */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Job Trends (24h)
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Thống kê hoạt động tuyển dụng trong 24 giờ gần nhất
          </p>
        </div>

        {/* BADGE */}
        <div
          className="
            flex items-center gap-2
            px-3 py-1.5
            rounded-full
            bg-indigo-50 text-indigo-600
            text-xs font-semibold
          "
        >
          <Clock className="w-4 h-4" />
          Last 24 hours
        </div>
      </div>

      {/* =====================
          CHART / EMPTY
      ===================== */}
      {!hasData ? (
        <EmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            {/* GRID */}
            <CartesianGrid
              stroke="#e5e7eb"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="hour"
              tickFormatter={formatHour}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />

            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />

            {/* TOOLTIP */}
            <Tooltip
              labelFormatter={formatHour}
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.95)",
                borderRadius: "14px",
                border: "1px solid #e5e7eb",
                boxShadow:
                  "0 12px 30px rgba(0,0,0,0.12)",
              }}
              labelStyle={{
                fontWeight: 600,
                color: "#111827",
                marginBottom: 4,
              }}
              itemStyle={{
                fontSize: 13,
                color: "#374151",
              }}
            />

            {/* LEGEND */}
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{
                fontSize: 13,
                paddingBottom: 12,
              }}
            />

            {/* JOBS CREATED */}
            <Line
              type="monotone"
              dataKey="created"
              name="Jobs Created"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                fill: "#4f46e5",
                strokeWidth: 0,
              }}
            />

            {/* JOBS APPROVED */}
            <Line
              type="monotone"
              dataKey="approved"
              name="Jobs Approved"
              stroke="#22c55e"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                fill: "#22c55e",
                strokeWidth: 0,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
