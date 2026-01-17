import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Lock,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { resetPassword } from "../services/authService";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null); // success | error
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    setMessage(null);
    setStatus(null);

    try {
      const res = await resetPassword(token, password);

      if (res?.success) {
        setStatus("success");
        setMessage("Đổi mật khẩu thành công, đang chuyển hướng...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setStatus("error");
        setMessage(res?.message || "Không thể đặt lại mật khẩu");
      }
    } catch {
      setStatus("error");
      setMessage("Link không hợp lệ hoặc đã hết hạn");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     INVALID TOKEN
  ===================== */
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white border border-red-200 rounded-3xl p-8 text-center max-w-md w-full">
          <AlertTriangle className="mx-auto text-red-500 mb-4" size={32} />
          <h2 className="text-xl font-semibold text-red-600">
            Liên kết không hợp lệ
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Link đặt lại mật khẩu không tồn tại hoặc đã hết hạn.
          </p>

          <button
            onClick={() => navigate("/forgot-password")}
            className="mt-6 px-6 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            Yêu cầu lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-xl p-8">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mb-4">
            <Lock size={26} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Đặt lại mật khẩu
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="
              w-full px-4 py-3
              border border-gray-300 rounded-xl
              focus:ring-2 focus:ring-green-500 focus:outline-none
            "
          />

          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="
              w-full px-4 py-3
              border border-gray-300 rounded-xl
              focus:ring-2 focus:ring-green-500 focus:outline-none
            "
          />

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full h-12 rounded-xl
              font-semibold text-white
              flex items-center justify-center gap-2
              transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }
            `}
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </form>

        {/* MESSAGE */}
        {message && (
          <div
            className={`
              mt-6 flex items-start gap-3
              px-4 py-3 rounded-xl text-sm
              ${
                status === "success"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }
            `}
          >
            {status === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertTriangle size={18} />
            )}
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
