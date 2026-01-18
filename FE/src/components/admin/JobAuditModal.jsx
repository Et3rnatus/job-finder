import {
  X,
  History,
  Clock,
} from "lucide-react";

export default function JobAuditModal({ onClose }) {
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
        <div className="py-12 text-center text-gray-400">
          <Clock className="w-10 h-10 mx-auto mb-4 opacity-40" />
          <p className="text-sm font-semibold">
            Chức năng đang phát triển
          </p>
          <p className="text-xs mt-1">
            Lịch sử duyệt công việc sẽ được bổ sung sau
          </p>
        </div>

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
