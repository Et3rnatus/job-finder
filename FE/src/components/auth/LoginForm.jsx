import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import { login } from "../../services/authService";
import {
  Mail,
  Lock,
  Loader2,
  XCircle,
} from "lucide-react";

/* =====================
   DECODE TOKEN
===================== */
const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  /* =====================
     VALIDATION
  ===================== */
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
    else if (newErrors.password)
      passwordRef.current?.focus();

    return Object.keys(newErrors).length === 0;
  };

  /* =====================
     SUBMIT
  ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await login({
        email: email.trim(),
        password: password.trim(),
      });

      const token = res.token;
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
    } catch {
      setErrorMessage(
        "Email hoặc mật khẩu không chính xác. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     RENDER
  ===================== */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.15)] bg-white">
        {/* ===== LEFT BRAND ===== */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-green-600 to-green-700 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              JobFinder
            </h1>
            <p className="text-lg opacity-90 mb-8">
              Nền tảng kết nối ứng viên và nhà tuyển dụng
              hàng đầu Việt Nam
            </p>

            <ul className="space-y-3 text-sm opacity-90">
              <li>✔ 10.000+ việc làm mới mỗi ngày</li>
              <li>✔ Ứng tuyển nhanh – hồ sơ chuyên nghiệp</li>
              <li>✔ Doanh nghiệp uy tín</li>
            </ul>
          </div>

          <p className="text-xs opacity-70">
            © 2025 JobFinder Vietnam
          </p>
        </div>

        {/* ===== RIGHT FORM ===== */}
        <div className="p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900">
            Đăng nhập
          </h2>
          <p className="text-gray-500 mt-1 mb-8">
            Chào mừng bạn quay trở lại 👋
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* EMAIL */}
            <FormInput
              ref={emailRef}
              icon={<Mail size={18} />}
              label="Email"
              placeholder="you@email.com"
              value={email}
              error={errors.email}
              onChange={(v) => {
                setEmail(v);
                setErrors((e) => ({ ...e, email: "" }));
              }}
              type="email"
            />

            {/* PASSWORD */}
            <FormInput
              ref={passwordRef}
              icon={<Lock size={18} />}
              label="Mật khẩu"
              placeholder="••••••••"
              value={password}
              error={errors.password}
              onChange={(v) => {
                setPassword(v);
                setErrors((e) => ({
                  ...e,
                  password: "",
                }));
              }}
              type="password"
            />

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-green-600 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full h-12 rounded-xl
                flex items-center justify-center gap-2
                font-semibold
                transition-all
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]"
                }
              `}
            >
              {loading && (
                <Loader2 className="animate-spin w-5 h-5" />
              )}
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <p className="text-sm text-center text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-green-600 font-medium hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* ===== ERROR MODAL ===== */}
      {errorMessage && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.25)] p-6 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <XCircle className="w-6 h-6" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 text-center">
              Đăng nhập thất bại
            </h3>
            <p className="text-sm text-gray-600 text-center mt-1 mb-6">
              {errorMessage}
            </p>

            <button
              onClick={() => setErrorMessage("")}
              className="w-full h-11 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================
   SMALL COMPONENT
===================== */

const FormInput = ({
  icon,
  label,
  error,
  value,
  onChange,
  type = "text",
  placeholder,
}, ref) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>

    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>

      <input
        ref={ref}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full h-12 pl-10 pr-4
          rounded-xl border
          text-sm
          focus:outline-none focus:ring-2
          ${
            error
              ? "border-red-500 focus:ring-red-300"
              : "border-gray-300 focus:ring-green-500"
          }
        `}
      />
    </div>

    {error && (
      <p className="text-sm text-red-500 mt-1">
        {error}
      </p>
    )}
  </div>
);
