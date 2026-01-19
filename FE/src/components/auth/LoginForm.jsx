import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, forwardRef } from "react";
import { login } from "../../services/authService";
import {
  Mail,
  Lock,
  Loader2,
  XCircle,
  Briefcase,
  Users,
  ShieldCheck,
} from "lucide-react";

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
    else if (newErrors.password) passwordRef.current?.focus();

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

      /* =========
         SAVE AUTH
      ========= */
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.user.role);

      // 🔥 CỰC KỲ QUAN TRỌNG: sync premium từ BACKEND
      if (res.user.role === "employer") {
        localStorage.setItem(
          "is_premium",
          res.user.is_premium.toString()
        );
      } else {
        localStorage.removeItem("is_premium");
      }

      /* =========
         REDIRECT
      ========= */
      if (res.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, {
          replace: true,
          state: { autoApply: true },
        });
      }
    } catch {
      setErrorMessage("Email hoặc mật khẩu không chính xác.");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     RENDER
  ===================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.15)]">

        {/* ===== LEFT BRAND ===== */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-green-600 to-green-700 text-white relative">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">
              JobFinder
            </h1>
            <p className="text-lg opacity-90 mb-10">
              Nền tảng kết nối ứng viên và nhà tuyển dụng
            </p>

            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Briefcase /> 10.000+ việc làm mỗi ngày
              </li>
              <li className="flex items-center gap-3">
                <Users /> Doanh nghiệp uy tín
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck /> Bảo mật & minh bạch
              </li>
            </ul>
          </div>

          <p className="text-xs opacity-70">
            © 2025 JobFinder Vietnam
          </p>

          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-white/10 rounded-full" />
        </div>

        {/* ===== RIGHT FORM ===== */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Đăng nhập
          </h2>
          <p className="text-gray-500 mt-1 mb-8">
            Chào mừng bạn quay trở lại 👋
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
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
            />

            <FormInput
              ref={passwordRef}
              icon={<Lock size={18} />}
              label="Mật khẩu"
              placeholder="••••••••"
              value={password}
              type="password"
              error={errors.password}
              onChange={(v) => {
                setPassword(v);
                setErrors((e) => ({ ...e, password: "" }));
              }}
            />

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-green-600 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 active:scale-[0.97]"
                }`}
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
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
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <XCircle />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-center">
              Đăng nhập thất bại
            </h3>
            <p className="text-sm text-gray-600 text-center mt-1 mb-6">
              {errorMessage}
            </p>

            <button
              onClick={() => setErrorMessage("")}
              className="w-full h-11 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
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
   FORM INPUT
===================== */
const FormInput = forwardRef(
  (
    { icon, label, error, value, onChange, type = "text", placeholder },
    ref
  ) => (
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
          className={`w-full h-12 pl-10 pr-4 rounded-xl border text-sm transition focus:outline-none focus:ring-2
            ${
              error
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-green-500"
            }`}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
);
