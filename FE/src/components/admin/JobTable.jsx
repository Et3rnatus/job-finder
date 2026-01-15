import {
  Eye,
  History,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function JobTable({
  jobs,
  onReview,
  onViewLogs,
}) {
  const statusConfig = {
    approved: {
      label: "Đã duyệt",
      badge:
        "bg-green-100 text-green-700 border-green-200",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    pending: {
      label: "Chờ duyệt",
      badge:
        "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
    rejected: {
      label: "Từ chối",
      badge:
        "bg-red-100 text-red-700 border-red-200",
      icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* ===== TABLE ===== */}
      <table className="w-full text-sm">
        {/* ===== HEADER ===== */}
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 text-left font-semibold text-gray-700">
              Công việc
            </th>
            <th className="p-4 text-left font-semibold text-gray-700">
              Nhà tuyển dụng
            </th>
            <th className="p-4 text-left font-semibold text-gray-700">
              Trạng thái
            </th>
            <th className="p-4 text-right font-semibold text-gray-700">
              Hành động
            </th>
          </tr>
        </thead>

        {/* ===== BODY ===== */}
        <tbody className="divide-y">
          {jobs.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="p-12 text-center text-gray-500"
              >
                Không có tin tuyển dụng nào
              </td>
            </tr>
          )}

          {jobs.map((job) => {
            const status =
              statusConfig[job.status] || {};

            return (
              <tr
                key={job.id}
                className="
                  group
                  hover:bg-gray-50
                  transition
                "
              >
                {/* ===== JOB ===== */}
                <td className="p-4">
                  <div className="font-medium text-gray-900 leading-snug line-clamp-2">
                    {job.title}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Job ID: #{job.id}
                  </div>
                </td>

                {/* ===== EMPLOYER ===== */}
                <td className="p-4 text-gray-600 truncate max-w-[240px]">
                  {job.employer_email}
                </td>

                {/* ===== STATUS ===== */}
                <td className="p-4">
                  <span
                    className={`
                      inline-flex items-center gap-1.5
                      px-3 py-1
                      rounded-full
                      text-xs font-semibold
                      border
                      ${status.badge ||
                        "bg-gray-100 text-gray-600 border-gray-200"}
                    `}
                  >
                    {status.icon}
                    {status.label || job.status}
                  </span>
                </td>

                {/* ===== ACTIONS ===== */}
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    {/* REVIEW */}
                    {job.status === "pending" ? (
                      <button
                        onClick={() => onReview(job.id)}
                        className="
                          inline-flex items-center gap-1.5
                          px-3 py-1.5
                          rounded-lg
                          bg-indigo-600
                          text-white
                          text-xs font-medium
                          hover:bg-indigo-700
                          active:scale-95
                          transition
                        "
                      >
                        <Eye className="w-4 h-4" />
                        Duyệt
                      </button>
                    ) : (
                      <span
                        className="
                          inline-flex items-center gap-1
                          text-xs text-gray-400
                          px-3 py-1.5
                        "
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Đã xử lý
                      </span>
                    )}

                    {/* LOGS */}
                    <button
                      onClick={() => onViewLogs(job.id)}
                      className="
                        inline-flex items-center gap-1.5
                        px-3 py-1.5
                        rounded-lg
                        bg-gray-100
                        text-gray-700
                        text-xs font-medium
                        border border-gray-200
                        hover:bg-gray-200
                        active:scale-95
                        transition
                      "
                    >
                      <History className="w-4 h-4" />
                      Lịch sử
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
