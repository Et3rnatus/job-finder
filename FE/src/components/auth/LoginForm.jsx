import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import { login } from "../../services/authService";
import { Mail, Lock, Loader2 } from "lucide-react";

// decode token
const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // 🔑 trang trước khi bị redirect sang login
  const from = location.state?.from || "/";

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    if (!password.trim()) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu tối thiểu 6 ký tự";
    }

    setErrors(newErrors);

    if (newErrors.email) emailRef.current?.focus();
    else if (newErrors.password) passwordRef.current?.focus();

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      const response = await login({
        email: email.trim(),
        password: password.trim(),
      });

      const token = response.token;
      localStorage.setItem("token", token);

      const decoded = decodeToken(token);
      const role = decoded?.role;
      localStorage.setItem("role", role);

      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, {
          replace: true,
          state: { autoApply: true },
        });
      }
    } catch (error) {
      setErrorMessage("Email hoặc mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT BRANDING */}
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-green-600 to-green-700 text-white p-10">
          <h1 className="text-4xl font-bold mb-4">
            JobFinder
          </h1>
          <p className="text-lg opacity-90 mb-6">
            Nền tảng kết nối ứng viên & nhà tuyển dụng hàng đầu Việt Nam
          </p>
          <ul className="space-y-3 text-sm opacity-90">
            <li>✔ 10.000+ việc làm mới mỗi ngày</li>
            <li>✔ Ứng tuyển nhanh – hồ sơ chuyên nghiệp</li>
            <li>✔ Nhà tuyển dụng uy tín</li>
          </ul>
        </div>

        {/* RIGHT FORM */}
        <div className="p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Đăng nhập
          </h2>
          <p className="text-gray-500 mb-8">
            Chào mừng bạn quay trở lại 👋
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: "" });
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2
                    ${
                      errors.email
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-green-500"
                    }`}
                  placeholder="you@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  ref={passwordRef}
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: "" });
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2
                    ${
                      errors.password
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-green-500"
                    }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <div className="text-center text-sm mt-4">
              <span className="text-gray-700">Chưa có tài khoản? </span>
              <Link to="/register" className="text-green-600 font-medium hover:underline">
                Đăng ký ngay
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* LOGIN FAIL MODAL */}
      {errorMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Đăng nhập thất bại
            </h3>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <button
              onClick={() => setErrorMessage("")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginForm;
