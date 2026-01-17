import { useState } from "react";
import {
  Mail,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { forgotPassword } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null); // success | error
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    setMessage(null);
    setStatus(null);

    try {
      const res = await forgotPassword(email);

      // ✅ Không tiết lộ email có tồn tại hay không (best practice)
      if (res?.success) {
        setStatus("success");
        setMessage(
          "Nếu email tồn tại trong hệ thống, chúng tôi đã gửi liên kết đặt lại mật khẩu. Vui lòng kiểm tra hộp thư đến hoặc thư rác (spam)."
        );
      } else {
        setStatus("success");
        setMessage(
          "Nếu email tồn tại trong hệ thống, chúng tôi đã gửi liên kết đặt lại mật khẩu. Vui lòng kiểm tra hộp thư đến hoặc thư rác (spam)."
        );
      }
    } catch {
      setStatus("error");
      setMessage(
        "Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-xl p-8">
        {/* =====================
            HEADER
        ===================== */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <Mail size={26} />
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            Quên mật khẩu
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu
          </p>
        </div>

        {/* =====================
            FORM
        ===================== */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email đăng ký
            </label>

            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="
                  w-full pl-10 pr-4 py-3
                  border border-gray-300 rounded-xl
                  text-sm
                  focus:ring-2 focus:ring-blue-500 focus:outline-none
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                "
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full inline-flex items-center justify-center gap-2
              py-3 rounded-xl font-semibold text-white
              transition-all
              active:scale-[0.98]
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              }
            `}
          >
            {loading && (
              <Loader2 size={18} className="animate-spin" />
            )}
            {loading ? "Đang gửi yêu cầu..." : "Gửi liên kết đặt lại"}
          </button>
        </form>

        {/* =====================
            MESSAGE
        ===================== */}
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

            <span className="leading-relaxed">
              {message}
            </span>
          </div>
        )}

        {/* FOOTER NOTE */}
        <p className="mt-6 text-xs text-gray-400 text-center">
          Vì lý do bảo mật, hệ thống không xác nhận email có tồn tại hay không.
        </p>
      </div>
    </div>
  );
}
