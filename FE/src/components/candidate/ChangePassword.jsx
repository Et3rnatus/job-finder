import { useState } from "react";
import { changePassword } from "../../services/authService";
import { Lock, Save, ArrowLeft } from "lucide-react";

export default function ChangePassword({ onCancel }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await changePassword(
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        token
      );

      setSuccess("Đổi mật khẩu thành công");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // 👉 auto quay về trang hồ sơ sau 1.2s (tuỳ thích)
      setTimeout(() => {
        onCancel && onCancel();
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Đổi mật khẩu thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm max-w-xl">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <ArrowLeft size={18} />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Lock size={18} />
          Đổi mật khẩu
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu hiện tại
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Nhập mật khẩu hiện tại"
          />
        </div>

        {/* New password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu mới
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Nhập mật khẩu mới"
          />
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Xác nhận mật khẩu mới
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Nhập lại mật khẩu mới"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-green-600">
            {success}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            <Save size={16} />
            {loading ? "Đang lưu..." : "Đổi mật khẩu"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-medium text-gray-600 hover:underline"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}