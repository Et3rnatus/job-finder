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

// format HH:mm
const formatHour = (value) => {
  const date = new Date(value);
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AdminDashboardTrends24h({ data }) {
  return (
    <div className="bg-white p-6 rounded shadow mt-8">
      <h2 className="text-lg font-semibold mb-4">
        Job Trends (Last 24 Hours)
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="hour"
            tickFormatter={formatHour}
          />

          <YAxis allowDecimals={false} />

          <Tooltip
            labelFormatter={formatHour}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="created"
            stroke="#2563eb"
            name="Jobs Created"
          />

          <Line
            type="monotone"
            dataKey="approved"
            stroke="#16a34a"
            name="Jobs Approved"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
