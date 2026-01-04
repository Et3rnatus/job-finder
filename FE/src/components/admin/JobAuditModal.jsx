import { useEffect, useState } from "react";
import { getJobLogs } from "../../services/adminService";

export default function JobAuditModal({ jobId, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const actionMap = {
    approved: {
      text: "Đã duyệt",
      className: "text-green-600",
    },
    rejected: {
      text: "Đã từ chối",
      className: "text-red-600",
    },
  };

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const res = await getJobLogs(jobId);
        setLogs(res);
      } catch (err) {
        console.error("GET JOB LOGS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, [jobId]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Lịch sử duyệt công việc
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        {/* CONTENT */}
        {loading && (
          <p className="text-gray-500 text-sm">
            Đang tải dữ liệu...
          </p>
        )}

        {!loading && logs.length === 0 && (
          <p className="text-gray-500 text-sm">
            Chưa có lịch sử duyệt
          </p>
        )}

        {!loading && logs.length > 0 && (
          <ul className="space-y-3">
            {logs.map((log) => {
              const action =
                actionMap[log.action] || {};

              return (
                <li
                  key={log.id}
                  className="border rounded-lg p-3 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800">
                      {log.admin_email}
                    </p>

                    <span
                      className={`font-semibold ${
                        action.className ||
                        "text-gray-600"
                      }`}
                    >
                      {action.text || log.action}
                    </span>
                  </div>

                  {log.note && (
                    <p className="text-gray-700 mt-2">
                      <span className="font-medium">
                        Lý do:
                      </span>{" "}
                      {log.note}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(
                      log.created_at
                    ).toLocaleString("vi-VN")}
                  </p>
                </li>
              );
            })}
          </ul>
        )}

        {/* FOOTER */}
        <div className="text-right mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
