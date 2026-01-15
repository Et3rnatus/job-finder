import { useState } from "react";
import { applyJob } from "../../services/applicationService";
import {
  X,
  FileText,
  ShieldCheck,
  Loader2,
  CheckCircle2,
} from "lucide-react";

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
      {/* =====================
          CLOSE
      ===================== */}
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="
          absolute top-4 right-4
          w-9 h-9 flex items-center justify-center
          rounded-full
          text-gray-400 hover:text-gray-700
          hover:bg-gray-100
          transition
          disabled:opacity-50
        "
      >
        <X size={18} />
      </button>

      {/* =====================
          HEADER
      ===================== */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Ứng tuyển công việc
        </h2>
        <p className="mt-2 text-green-600 font-medium truncate">
          {jobTitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* =====================
            CV INFO
        ===================== */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border bg-gray-50">
          <div className="flex items-center gap-3">
            <FileText className="text-green-600" size={22} />
            <div>
              <p className="text-sm font-medium text-gray-800">
                Hồ sơ sử dụng
              </p>
              <p className="text-xs text-gray-500">
                CV Online trên hệ thống
              </p>
            </div>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
            Mặc định
          </span>
        </div>

        {/* =====================
            COVER LETTER
        ===================== */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thư giới thiệu{" "}
            <span className="text-gray-400 font-normal">
              (không bắt buộc)
            </span>
          </label>

          <textarea
            rows={6}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Giới thiệu ngắn gọn về kinh nghiệm, kỹ năng phù hợp và lý do bạn ứng tuyển vị trí này..."
            className="
              w-full rounded-2xl border px-4 py-3
              text-sm leading-relaxed
              focus:outline-none focus:ring-2 focus:ring-green-500
              resize-none
            "
          />

          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Gợi ý: 2–3 đoạn ngắn, súc tích</span>
            <span>{coverLetter.length} ký tự</span>
          </div>
        </div>

        {/* =====================
            AGREEMENT
        ===================== */}
        <label className="flex items-start gap-3 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1 accent-green-600"
          />
          <span>
            Tôi đồng ý cho phép hệ thống sử dụng thông tin cá nhân
            phục vụ mục đích tuyển dụng theo{" "}
            <span className="text-green-600 font-medium cursor-pointer hover:underline">
              điều khoản sử dụng
            </span>
          </span>
        </label>

        {/* =====================
            ACTION
        ===================== */}
        <div className="pt-2 space-y-3">
          <button
            type="submit"
            disabled={!agree || loading}
            className={`
              w-full h-14 rounded-2xl
              font-semibold text-base
              flex items-center justify-center gap-2
              transition-all duration-200
              ${
                !agree || loading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 active:scale-[0.97]"
              }
            `}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Đang gửi hồ sơ...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Nộp hồ sơ ứng tuyển
              </>
            )}
          </button>

          {/* TRUST NOTE */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck size={14} />
            Thông tin của bạn được bảo mật tuyệt đối
          </div>
        </div>
      </form>
    </div>
  );
}

export default ApplyForm;
