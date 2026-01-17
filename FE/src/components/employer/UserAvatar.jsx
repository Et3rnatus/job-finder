import { useRef, useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { toast } from "react-hot-toast";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const API_URL = "http://127.0.0.1:3001";

export default function UserAvatar({
  name = "Người dùng",
  image,                 // path ảnh từ DB ("/uploads/...")
  onUpload,              // async function upload(file) => return image path
  label = "Thay đổi ảnh",
  defaultImage = "/default-avatar.png",
}) {
  const fileRef = useRef(null);
  const [avatar, setAvatar] = useState(image);
  const [loading, setLoading] = useState(false);

  /* =====================
     SYNC IMAGE FROM PROPS
  ===================== */
  useEffect(() => {
    setAvatar(image);
  }, [image]);

  /* =====================
     HELPERS
  ===================== */
  const getAvatarSrc = () => {
    if (!avatar) return defaultImage;

    // preview blob
    if (avatar.startsWith("blob:")) return avatar;

    // image from server
    return `${API_URL}${avatar}`;
  };

  /* =====================
     FILE HANDLERS
  ===================== */
  const handleSelectFile = () => {
    if (!loading) {
      fileRef.current?.click();
    }
  };

  const handleChange = async (e) => {
    const file = e.target.files[0];
    e.target.value = null;
    if (!file) return;

    /* ===== VALIDATE ===== */
    if (!file.type.startsWith("image/")) {
      toast.error("Chỉ được chọn file ảnh");
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error("Ảnh không được vượt quá 2MB");
      return;
    }

    // preview ngay
    const previewUrl = URL.createObjectURL(file);
    setAvatar(previewUrl);

    try {
      setLoading(true);

      // upload bên ngoài
      const uploadedPath = await onUpload(file);

      if (!uploadedPath) {
        throw new Error("Upload không trả về ảnh");
      }

      setAvatar(uploadedPath);
      toast.success("Cập nhật ảnh thành công");
    } catch (err) {
      console.error(err);
      toast.error("Upload ảnh thất bại");
      setAvatar(image); // rollback
    } finally {
      setLoading(false);
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center shadow-sm hover:shadow-lg transition">
      {/* =====================
         AVATAR
      ===================== */}
      <div
        onClick={handleSelectFile}
        className={`relative w-fit mx-auto group ${
          loading ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {/* glow */}
        <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 blur-xl opacity-40" />

        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 p-1">
          <img
            src={getAvatarSrc()}
            alt="avatar"
            className="w-full h-full rounded-full object-cover bg-white"
          />

          {/* overlay */}
          <div
            className={`absolute inset-0 rounded-full flex flex-col items-center justify-center text-white text-xs font-semibold transition ${
              loading
                ? "bg-black/60 opacity-100"
                : "bg-black/0 opacity-0 group-hover:bg-black/50 group-hover:opacity-100"
            }`}
          >
            {loading ? (
              <span>Đang tải...</span>
            ) : (
              <>
                <Camera size={20} className="mb-1" />
                Đổi ảnh
              </>
            )}
          </div>
        </div>
      </div>

      {/* hidden input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleChange}
        disabled={loading}
      />

      {/* =====================
         NAME
      ===================== */}
      <h3 className="mt-5 text-lg font-semibold text-gray-900 truncate">
        {name}
      </h3>

      <p className="text-xs text-gray-500 mt-1">
        Hồ sơ cá nhân
      </p>

      {/* =====================
         ACTION
      ===================== */}
      <button
        onClick={handleSelectFile}
        disabled={loading}
        className={`mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition ${
          loading
            ? "cursor-not-allowed bg-gray-100 text-gray-400"
            : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
        }`}
      >
        <Camera size={16} />
        {label}
      </button>
    </div>
  );
}
