export default function StatCard({ title, value, highlight = false }) {
  return (
    <div
      className={`rounded shadow p-6 border
        ${
          highlight
            ? "bg-red-50 border-red-300"
            : "bg-white border-gray-200"
        }`}
    >
      <p
        className={`text-sm ${
          highlight ? "text-red-600" : "text-gray-500"
        }`}
      >
        {title}
      </p>

      <p
        className={`text-3xl font-bold mt-2 ${
          highlight ? "text-red-700" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
