import { useEffect, useState } from "react";
import { getJobLogs } from "../../services/adminService";
import {
  X,
  ShieldCheck,
  ShieldX,
  Clock,
  History,
} from "lucide-react";

export default function JobAuditModal({ jobId, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =====================
     ACTION CONFIG
  ===================== */
  const actionMap = {
    approved: {
      text: "Đã duyệt",
      className:
        "text-green-700 bg-green-100 border-green-200",
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    rejected: {
      text: "Đã từ chối",
      className:
        "text-red-700 bg-red-100 border-red-200",
      icon: <ShieldX className="w-4 h-4" />,
    },
  };

  /* =====================
     FETCH LOGS
  ===================== */
  useEffect(() => {
    const loadLogs = async () => {
      try {
        setLoading(true);
        const res = await getJobLogs(jobId);
        setLogs(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("GET JOB LOGS ERROR:", err);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) loadLogs();
  }, [jobId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="
          w-full max-w-xl
          rounded-2xl
          bg-white
          border border-gray-200
          shadow-[0_26px_80px_rgba(0,0,0,0.28)]
          p-6
          animate-[fadeIn_0.2s_ease-out]
        "
      >
        {/* =====================
            HEADER
        ===================== */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              Lịch sử duyệt công việc
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Nhật ký xét duyệt của quản trị viên
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              rounded-lg p-2
              text-gray-400
              hover:text-gray-600
              hover:bg-gray-100
              transition
            "
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =====================
            CONTENT
        ===================== */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500">
            <Clock className="w-4 h-4 animate-pulse" />
            Đang tải lịch sử duyệt...
          </div>
        )}

        {!loading && logs.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <Clock className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">
              Chưa có lịch sử duyệt
            </p>
            <p className="text-xs mt-1">
              Công việc này chưa từng được xét duyệt
            </p>
          </div>
        )}

        {!loading && logs.length > 0 && (
          <ul className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {logs.map((log, index) => {
              const action =
                actionMap[log.action] || {};
              const isLast =
                index === logs.length - 1;

              return (
                <li
                  key={log.id || index}
                  className="
                    relative
                    rounded-xl
                    border border-gray-200
                    bg-white
                    p-4
                    hover:shadow-md
                    transition
                  "
                >
                  {/* TIMELINE LINE */}
                  {!isLast && (
                    <span className="absolute left-5 top-full h-4 w-px bg-gray-200" />
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {log.admin_email}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(
                          log.created_at
                        ).toLocaleString("vi-VN")}
                      </p>
                    </div>

                    <span
                      className={`
                        inline-flex items-center gap-1.5
                        px-2.5 py-1
                        rounded-full
                        text-xs font-semibold
                        border
                        ${
                          action.className ||
                          "text-gray-600 bg-gray-100 border-gray-200"
                        }
                      `}
                    >
                      {action.icon}
                      {action.text || log.action}
                    </span>
                  </div>

                  {log.note && (
                    <div className="mt-3 text-sm text-gray-700">
                      <span className="font-medium">
                        Ghi chú:
                      </span>{" "}
                      {log.note}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* =====================
            FOOTER
        ===================== */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="
              px-5 py-2
              rounded-lg
              border border-gray-300
              text-sm font-medium
              text-gray-700
              hover:bg-gray-100
              transition
            "
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
