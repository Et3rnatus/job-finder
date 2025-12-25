
function ApplyButton({ onApply }) {
  return (
    <button
      onClick={onApply}
      className="w-full bg-blue-600 text-white font-medium py-3 rounded mt-4 hover:bg-blue-700 transition"
    >
      Ứng tuyển ngay
    </button>
  );
}
export default ApplyButton;
