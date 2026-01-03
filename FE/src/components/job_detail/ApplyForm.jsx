import { useState } from "react";
import { applyJob } from "../../services/applicationService";

function ApplyForm({ jobId, jobTitle, onSuccess, onClose }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree || loading) return;

    try {
      setLoading(true);

      await applyJob({
        job_id: jobId,
        cover_letter: coverLetter,
      });

      onSuccess && onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Ứng tuyển thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* ===== CLOSE BUTTON ===== */}
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="
          absolute top-3 right-4
          text-gray-400 hover:text-gray-600
          text-2xl font-bold
          disabled:opacity-50
        "
      >
        ×
      </button>

      {/* ===== HEADER ===== */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Ứng tuyển vị trí
        </h2>
        <p className="text-green-600 font-medium mt-1 truncate">
          {jobTitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ===== CV INFO ===== */}
        <div className="rounded-xl border bg-gray-50 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hồ sơ sử dụng
          </label>
          <div className="flex items-center justify-between">
            <span className="text-gray-800 font-medium">
              CV Online
            </span>
            <span className="text-xs text-gray-500">
              Hồ sơ trên hệ thống
            </span>
          </div>
        </div>

        {/* ===== COVER LETTER ===== */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thư giới thiệu <span className="text-gray-400">(không bắt buộc)</span>
          </label>
          <textarea
            rows={5}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Giới thiệu ngắn gọn về bản thân, kinh nghiệm phù hợp và lý do bạn ứng tuyển vị trí này..."
            className="
              w-full rounded-xl border px-4 py-3
              text-sm
              focus:outline-none focus:ring-2 focus:ring-green-500
            "
          />
          <p className="text-xs text-gray-500 mt-1">
            Gợi ý: 2–3 đoạn ngắn, tập trung vào giá trị bạn mang lại
          </p>
        </div>

        {/* ===== AGREEMENT ===== */}
        <label className="flex items-start gap-3 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1 accent-green-600"
          />
          <span>
            Tôi đồng ý cho phép hệ thống sử dụng thông tin cá nhân
            nhằm mục đích tuyển dụng theo{" "}
            <span className="text-green-600 font-medium cursor-pointer">
              điều khoản sử dụng
            </span>
          </span>
        </label>

        {/* ===== ACTION BUTTON ===== */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!agree || loading}
            className="
              w-full h-12 rounded-xl font-semibold
              bg-green-600 text-white
              hover:bg-green-700
              active:scale-[0.98]
              transition
              disabled:bg-gray-300
              disabled:text-gray-600
              disabled:cursor-not-allowed
            "
          >
            {loading ? "Đang gửi hồ sơ..." : "Nộp hồ sơ ứng tuyển"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ApplyForm;
