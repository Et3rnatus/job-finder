import { useRef, useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Camera,
  Loader2,
} from "lucide-react";
import candidateService from "../../services/candidateService";
import { toast } from "react-hot-toast";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const API_URL = "http://127.0.0.1:3001";

export default function UserAvatar({
  fullName,
  isProfileCompleted,
  candidateImage,
  onAvatarUpdated,
}) {
  const fileRef = useRef(null);

  // avatar hiển thị (có thể là preview hoặc url server)
  const [avatar, setAvatar] = useState(candidateImage);
  const [loading, setLoading] = useState(false);

  /* =====================
     SYNC AVATAR
  ===================== */
  useEffect(() => {
    setAvatar(candidateImage);
  }, [candidateImage]);

  /* =====================
     SELECT FILE
  ===================== */
  const handleSelectFile = () => {
    if (loading) return;
    fileRef.current?.click();
  };

  /* =====================
     UPLOAD AVATAR
  ===================== */
  const handleChangeAvatar = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = null; // reset input
    if (!file) return;

    /* ===== FRONTEND VALIDATE ===== */
    if (!file.type.startsWith("image/")) {
      toast.error("Chỉ được chọn file ảnh");
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error("Ảnh không được vượt quá 2MB");
      return;
    }

    // preview ngay cho UX
    const previewUrl = URL.createObjectURL(file);
    setAvatar(previewUrl);

    try {
      setLoading(true);

      const res = await candidateService.updateAvatar(
        file
      );

      // server trả về đường dẫn ảnh mới
      setAvatar(res.candidate_image);
      toast.success("Cập nhật ảnh đại diện thành công");

      onAvatarUpdated?.();
    } catch (err) {
      console.error("UPLOAD AVATAR ERROR:", err);
      toast.error("Upload ảnh thất bại");

      // rollback về ảnh cũ
      setAvatar(candidateImage);
    } finally {
      setLoading(false);
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <div className="relative bg-white border border-gray-200 rounded-3xl p-6 text-center shadow-sm hover:shadow-lg transition">
      {/* =====================
          AVATAR
      ===================== */}
      <div className="relative w-fit mx-auto">
        {/* SOFT GLOW */}
        <div
          className={`absolute -inset-1 rounded-full blur-xl opacity-50 ${
            isProfileCompleted
              ? "bg-gradient-to-br from-green-400 to-emerald-500"
              : "bg-gradient-to-br from-red-400 to-orange-400"
          }`}
        />

        <div className="relative">
          <img
            src={
              avatar
                ? avatar.startsWith("blob:")
                  ? avatar
                  : `${API_URL}${avatar}`
                : "/default-avatar.png"
            }
            alt="avatar"
            className={`w-32 h-32 rounded-full object-cover border-4 bg-white ${
              isProfileCompleted
                ? "border-emerald-500"
                : "border-red-400"
            }`}
          />

          {/* STATUS DOT */}
          <span
            className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${
              isProfileCompleted
                ? "bg-emerald-500"
                : "bg-red-400"
            }`}
          />

          {/* OVERLAY */}
          <div
            onClick={handleSelectFile}
            className={`absolute inset-0 rounded-full flex items-center justify-center transition ${
              loading
                ? "bg-black/60 cursor-not-allowed"
                : "bg-black/0 hover:bg-black/50 cursor-pointer"
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Camera className="w-6 h-6 text-white" />
            )}
          </div>
        </div>
      </div>

      {/* FILE INPUT */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleChangeAvatar}
      />

      {/* =====================
          NAME
      ===================== */}
      <h3 className="mt-5 text-lg font-semibold text-gray-900 truncate">
        {fullName || "Ứng viên"}
      </h3>

      {/* =====================
          STATUS
      ===================== */}
      <div className="mt-2 flex justify-center">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${
            isProfileCompleted
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {isProfileCompleted ? (
            <CheckCircle2 size={14} />
          ) : (
            <AlertTriangle size={14} />
          )}
          {isProfileCompleted
            ? "Hồ sơ đã hoàn thiện"
            : "Hồ sơ chưa hoàn thiện"}
        </span>
      </div>

      {/* =====================
          CTA
      ===================== */}
      {!isProfileCompleted && (
        <button
          onClick={() =>
            document
              .getElementById("profile-form")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="mt-4 px-5 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white hover:opacity-90 transition"
        >
          Hoàn thiện hồ sơ
        </button>
      )}
    </div>
  );
}
