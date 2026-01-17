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
import { TrendingUp, Activity } from "lucide-react";

/* =====================
   FORMATTERS
===================== */
const formatDate = (value) => {
  const date = new Date(value);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
};

/* =====================
   EMPTY STATE
===================== */
function EmptyState() {
  return (
    <div className="h-[320px] flex flex-col items-center justify-center text-gray-400">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Activity className="w-7 h-7 opacity-50" />
      </div>
      <p className="text-sm font-semibold">
        Chưa có dữ liệu thống kê
      </p>
      <p className="text-xs mt-1 text-gray-400">
        Dữ liệu sẽ hiển thị khi có hoạt động tuyển dụng
      </p>
    </div>
  );
}

export default function AdminDashboardTrends({ data = [] }) {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div
      className="
        mt-8
        rounded-2xl
        bg-white
        border border-gray-200
        shadow-[0_10px_40px_rgba(0,0,0,0.08)]
        p-6
        transition-all
        hover:shadow-[0_18px_60px_rgba(0,0,0,0.12)]
      "
    >
      {/* =====================
          HEADER
      ===================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Job Trends
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Thống kê hoạt động tuyển dụng trong 7 ngày gần nhất
          </p>
        </div>

        {/* BADGE */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
          <TrendingUp className="w-4 h-4" />
          Last 7 days
        </div>
      </div>

      {/* =====================
          CHART / EMPTY STATE
      ===================== */}
      {!hasData ? (
        <EmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            {/* GRID */}
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              allowDecimals={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            {/* TOOLTIP */}
            <Tooltip
              labelFormatter={formatDate}
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.96)",
                borderRadius: "14px",
                border: "1px solid #e5e7eb",
                boxShadow:
                  "0 14px 40px rgba(0,0,0,0.15)",
              }}
              labelStyle={{
                fontWeight: 600,
                color: "#111827",
                marginBottom: 6,
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
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                fill: "#2563eb",
                strokeWidth: 0,
              }}
            />

            {/* JOBS APPROVED */}
            <Line
              type="monotone"
              dataKey="approved"
              name="Jobs Approved"
              stroke="#16a34a"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                fill: "#16a34a",
                strokeWidth: 0,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
