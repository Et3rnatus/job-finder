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

// ✅ format ngày DD/MM (CHO LAST 7 DAYS)
const formatDate = (value) => {
  const date = new Date(value);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
};

export default function AdminDashboardTrends({ data }) {
  return (
    <div className="bg-white p-6 rounded shadow mt-8">
      <h2 className="text-lg font-semibold mb-4">
        Job Trends (Last 7 Days)
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          {/* ✅ HIỂN THỊ NGÀY – KHÔNG HIỂN THỊ GIỜ */}
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
          />

          <YAxis allowDecimals={false} />

          {/* Tooltip hiển thị ngày đẹp */}
          <Tooltip
            labelFormatter={formatDate}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="created"
            stroke="#2563eb"
            name="Jobs Created"
            strokeWidth={2}
            dot={{ r: 3 }}
          />

          <Line
            type="monotone"
            dataKey="approved"
            stroke="#16a34a"
            name="Jobs Approved"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
