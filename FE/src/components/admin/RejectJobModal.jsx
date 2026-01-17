import { useState } from "react";
import {
  XCircle,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";

export default function RejectJobModal({
  onClose,
  onSubmit,
}) {
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  /* =====================
     SUBMIT
  ===================== */
  const handleSubmit = async () => {
    if (!note.trim()) {
      setError("Vui lòng nhập lý do từ chối");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(note.trim());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="
          w-full max-w-md
          rounded-2xl
          bg-white
          border border-gray-200
          shadow-[0_22px_65px_rgba(0,0,0,0.28)]
          p-6
          animate-[fadeIn_0.2s_ease-out]
        "
      >
        {/* =====================
            HEADER
        ===================== */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Từ chối tin tuyển dụng
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Hành động này yêu cầu lý do rõ ràng
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={submitting}
            className="
              p-2 rounded-lg
              text-gray-400
              hover:bg-gray-100
              hover:text-gray-600
              transition
              disabled:opacity-50
            "
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =====================
            WARNING
        ===================== */}
        <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
          Lý do từ chối sẽ được gửi cho nhà tuyển dụng để họ
          chỉnh sửa nội dung và gửi lại tin tuyển dụng.
        </div>

        {/* =====================
            INPUT
        ===================== */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lý do từ chối{" "}
            <span className="text-red-500">*</span>
          </label>

          <textarea
            rows={4}
            placeholder="Ví dụ: Nội dung mô tả chưa rõ ràng, thiếu thông tin mức lương..."
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setError("");
            }}
            disabled={submitting}
            className="
              w-full
              rounded-xl
              border border-gray-300
              p-3
              text-sm
              resize-none
              focus:outline-none
              focus:ring-2
              focus:ring-red-200
              disabled:bg-gray-100
            "
          />

          {error && (
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        {/* =====================
            ACTIONS
        ===================== */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={submitting}
            className="
              px-4 py-2
              rounded-xl
              border border-gray-300
              text-sm font-medium
              text-gray-700
              hover:bg-gray-100
              transition
              disabled:opacity-50
            "
          >
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="
              inline-flex items-center gap-2
              px-4 py-2
              rounded-xl
              bg-red-600
              text-white
              text-sm font-medium
              hover:bg-red-700
              active:scale-[0.97]
              transition
              disabled:opacity-50
            "
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Xác nhận từ chối
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
