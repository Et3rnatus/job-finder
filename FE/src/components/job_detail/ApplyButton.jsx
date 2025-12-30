function ApplyButton({ onApply, disabled = false, text = "Ứng tuyển" }) {
  return (
    <button
      onClick={onApply}
      disabled={disabled}
      className={`w-full py-3 mt-4 rounded-lg text-base font-semibold transition
        ${
          disabled
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
    >
      {text}
    </button>
  );
}

export default ApplyButton;
