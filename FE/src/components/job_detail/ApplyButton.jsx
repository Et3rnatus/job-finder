import { Heart, CheckCircle2, Loader2 } from "lucide-react";

function ApplyButton({
  applied = false,
  disabled = false,
  onApply,
  buttonText = "Ứng tuyển ngay",
  onToggleSave,
  saved = false,
  saving = false,
}) {
  return (
    <div className="flex items-stretch gap-4">
      {/* =====================
          APPLY BUTTON
      ===================== */}
      <button
        onClick={onApply}
        disabled={disabled || applied}
        className={`
          group relative flex-1 h-14
          rounded-2xl
          font-semibold text-base
          flex items-center justify-center gap-2
          transition-all duration-200
          ${
            applied
              ? "bg-green-50 text-green-700 cursor-default border border-green-200"
              : disabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 active:scale-[0.97]"
          }
        `}
      >
        {/* SHINE EFFECT */}
        {!applied && !disabled && (
          <span
            className="
              pointer-events-none
              absolute inset-0
              rounded-2xl
              opacity-0 group-hover:opacity-100
              bg-gradient-to-r from-white/20 via-white/5 to-transparent
              transition
            "
          />
        )}

        {applied ? (
          <>
            <CheckCircle2 size={18} />
            Đã ứng tuyển
          </>
        ) : (
          buttonText
        )}
      </button>

      {/* =====================
          SAVE BUTTON
      ===================== */}
      <button
        onClick={onToggleSave}
        disabled={saving}
        title={saved ? "Bỏ lưu công việc" : "Lưu công việc"}
        className={`
          relative w-14 h-14
          flex items-center justify-center
          rounded-2xl
          transition-all duration-200
          ${
            saved
              ? "bg-gradient-to-br from-green-50 to-green-100 text-green-600 shadow-inner"
              : "bg-white border border-gray-300 text-gray-500 hover:border-green-500 hover:text-green-600"
          }
          ${saving ? "cursor-not-allowed opacity-60" : "active:scale-95"}
        `}
      >
        {/* PULSE WHEN SAVED */}
        {saved && (
          <span className="absolute inset-0 rounded-2xl bg-green-400/10 animate-pulse" />
        )}

        {saving ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <Heart
            className="w-6 h-6 relative z-10"
            fill={saved ? "currentColor" : "none"}
          />
        )}
      </button>
    </div>
  );
}

export default ApplyButton;
