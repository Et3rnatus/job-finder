export default function JobTable({
  jobs,
  onReview,
  onViewLogs,
}) {
  const renderStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Employer</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {jobs.length === 0 && (
            <tr>
              <td
                colSpan="4"
                className="p-4 text-center text-gray-500"
              >
                No jobs found
              </td>
            </tr>
          )}

          {jobs.map((job) => (
            <tr
              key={job.id}
              className="border-t hover:bg-gray-50"
            >
              {/* TITLE */}
              <td className="p-3 font-medium">
                {job.title}
              </td>

              {/* EMPLOYER */}
              <td className="p-3">
                {job.employer_email}
              </td>

              {/* STATUS */}
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${renderStatusBadge(
                    job.status
                  )}`}
                >
                  {job.status}
                </span>
              </td>

              {/* ACTION */}
              <td className="p-3 space-x-2">
                {/* 🔍 Review job (pending only) */}
                {job.status === "pending" ? (
                  <button
                    onClick={() => onReview(job.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                  >
                    Xem & duyệt
                  </button>
                ) : (
                  <span className="text-gray-400 text-xs mr-2">
                    Đã xử lý
                  </span>
                )}

                {/* 📜 Audit history (luôn cho xem) */}
                <button
                  onClick={() => onViewLogs(job.id)}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                >
                  Lịch sử
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
