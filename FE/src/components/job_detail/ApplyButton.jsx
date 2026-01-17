import { Heart, CheckCircle2, Loader2, Send } from "lucide-react";

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
              ? "bg-emerald-50 text-emerald-700 cursor-default border border-emerald-200"
              : disabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-green-700 active:scale-[0.97]"
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
              bg-gradient-to-r from-white/25 via-white/10 to-transparent
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
          <>
            <Send size={18} />
            {buttonText}
          </>
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
              ? "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 shadow-inner"
              : "bg-white border border-gray-300 text-gray-500 hover:border-emerald-500 hover:text-emerald-600"
          }
          ${saving ? "cursor-not-allowed opacity-60" : "active:scale-95"}
        `}
      >
        {/* PULSE EFFECT WHEN SAVED */}
        {saved && (
          <span className="absolute inset-0 rounded-2xl bg-emerald-400/10 animate-pulse" />
        )}

        {saving ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <Heart
            className="w-6 h-6 relative z-10 transition"
            fill={saved ? "currentColor" : "none"}
          />
        )}
      </button>
    </div>
  );
}

export default ApplyButton;
