import { Heart } from "lucide-react";

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
    <div className="flex items-center gap-4">
      {/* APPLY BUTTON */}
      <button
        onClick={onApply}
        disabled={disabled || applied}
        className={`
          flex-1 h-12 rounded-xl font-semibold text-base
          transition-all duration-200
          ${
            applied || disabled
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]"
          }
        `}
      >
        {buttonText}
      </button>

      {/* SAVE BUTTON */}
      <button
        onClick={onToggleSave}
        disabled={saving}
        title={saved ? "Bỏ lưu công việc" : "Lưu công việc"}
        className={`
          w-12 h-12 flex items-center justify-center
          rounded-xl border transition-all duration-200
          ${
            saved
              ? "border-green-600 bg-green-50 text-green-600"
              : "border-gray-300 text-gray-500 hover:border-green-600 hover:text-green-600"
          }
          active:scale-95
        `}
      >
        <Heart
          className="w-5 h-5"
          fill={saved ? "currentColor" : "none"}
        />
      </button>
    </div>
  );
}

export default ApplyButton;
