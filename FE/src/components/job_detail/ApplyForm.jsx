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

      alert("Ứng tuyển thành công");

      // 🔑 chỉ cần gọi onSuccess
      // ApplyButton sẽ tự disable + đóng modal
      onSuccess && onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Ứng tuyển thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 relative">
      {/* ❌ CLOSE */}
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="
          absolute top-4 right-4
          text-gray-400 hover:text-gray-600
          text-xl font-bold
          disabled:opacity-50
        "
      >
        ×
      </button>

      {/* HEADER */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Ứng tuyển <span className="text-green-600">{jobTitle}</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CV */}
        <div>
          <label className="block text-sm font-medium mb-2">
            CV sử dụng
          </label>
          <select
            disabled
            className="w-full border rounded px-4 py-2 bg-gray-100"
          >
            <option>CV Online</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Sử dụng hồ sơ trực tuyến trên hệ thống
          </p>
        </div>

        {/* COVER LETTER */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Thư giới thiệu
          </label>
          <textarea
            rows={5}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-green-500"
            placeholder="Giới thiệu ngắn gọn về bản thân và lý do ứng tuyển"
          />
        </div>

        {/* AGREEMENT */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          Tôi đồng ý với điều khoản sử dụng dữ liệu cá nhân
        </label>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={!agree || loading}
          className="
            w-full py-3 rounded-full font-semibold
            bg-green-600 text-white
            hover:bg-green-700
            disabled:bg-gray-300
            disabled:text-gray-600
            disabled:cursor-not-allowed
          "
        >
          {loading ? "Đang gửi..." : "Nộp hồ sơ ứng tuyển"}
        </button>
      </form>
    </div>
  );
}

export default ApplyForm;
