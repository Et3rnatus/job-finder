import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await resetPassword(token, password);

      if (res.success) {
        setMessage("Đổi mật khẩu thành công, đang chuyển hướng...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(res.message || "Không thể đặt lại mật khẩu");
      }
    } catch (err) {
      setMessage("Link không hợp lệ hoặc đã hết hạn");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <p className="text-center mt-20 text-red-500">
        Link đặt lại mật khẩu không hợp lệ
      </p>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Đặt lại mật khẩu
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full border p-2 rounded mb-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-60"
        >
          {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
        </button>
      </form>

      {message && (
        <p className="text-center text-sm mt-4 text-gray-600">
          {message}
        </p>
      )}
    </div>
  );
}
