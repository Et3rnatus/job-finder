
function ApplyButton({ onApply }) {
  return (
    <button
      onClick={onApply}
      className="w-full bg-green-600 text-white font-medium py-3 rounded mt-4 hover:bg-green-700 transition"
    >
      Ứng tuyển ngay
    </button>
  );
}
export default ApplyButton;
