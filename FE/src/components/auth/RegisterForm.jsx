import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, forwardRef } from "react";
import { register } from "../../services/authService";
import {
  Mail,
  Lock,
  UserPlus,
  Loader2,
  CheckCircle2,
  XCircle,
  Briefcase,
  ShieldCheck,
} from "lucide-react";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "candidate",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  /* =====================
     VALIDATION
  ===================== */
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    if (!form.password.trim()) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu tối thiểu 6 ký tự";
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu nhập lại không khớp";
    }

    setErrors(newErrors);

    if (newErrors.email) emailRef.current?.focus();
    else if (newErrors.password) passwordRef.current?.focus();
    else if (newErrors.confirmPassword)
      confirmPasswordRef.current?.focus();

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
      const { confirmPassword, ...data } = form;
      await register(data);

      setModal({
        type: "success",
        title: "Đăng ký thành công 🎉",
        message:
          "Tài khoản của bạn đã được tạo. Vui lòng đăng nhập để tiếp tục.",
      });
    } catch (err) {
      setModal({
        type: "error",
        title: "Đăng ký thất bại",
        message:
          err.response?.data?.message ||
          "Email đã tồn tại hoặc hệ thống gặp lỗi.",
      });
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
            <h1 className="text-4xl font-extrabold mb-4">
              Tham gia JobFinder
            </h1>
            <p className="text-lg opacity-90 mb-10">
              Tạo hồ sơ – Kết nối – Phát triển sự nghiệp
            </p>

            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Briefcase /> Hàng nghìn việc làm chất lượng
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck /> Bảo mật & minh bạch
              </li>
              <li className="flex items-center gap-3">
                <UserPlus /> Miễn phí cho ứng viên
              </li>
            </ul>
          </div>

          <p className="text-xs opacity-70">
            © 2025 JobFinder Vietnam
          </p>

          {/* Decorative */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-white/10 rounded-full" />
        </div>

        {/* ===== RIGHT FORM ===== */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Đăng ký tài khoản
          </h2>
          <p className="text-gray-500 mt-1 mb-8">
            Bắt đầu hành trình nghề nghiệp 🚀
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              ref={emailRef}
              icon={<Mail size={18} />}
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="you@email.com"
              type="email"
            />

            <InputField
              ref={passwordRef}
              icon={<Lock size={18} />}
              label="Mật khẩu"
              name="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              type="password"
            />

            <InputField
              ref={confirmPasswordRef}
              icon={<Lock size={18} />}
              label="Nhập lại mật khẩu"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="••••••••"
              type="password"
            />

            {/* ROLE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại tài khoản
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="candidate">Ứng viên</option>
                <option value="employer">Nhà tuyển dụng</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 active:scale-[0.97]"
                }`}
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>

            <p className="text-sm text-center text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-green-600 font-medium hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] text-center animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-center mb-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center
                  ${
                    modal.type === "success"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
              >
                {modal.type === "success" ? (
                  <CheckCircle2 />
                ) : (
                  <XCircle />
                )}
              </div>
            </div>

            <h3 className="text-lg font-semibold">
              {modal.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1 mb-6">
              {modal.message}
            </p>

            <button
              onClick={() => {
                setModal(null);
                if (modal.type === "success")
                  navigate("/login");
              }}
              className="w-full h-11 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================
   INPUT FIELD
===================== */
const InputField = forwardRef(
  ({ icon, label, error, ...props }, ref) => (
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
          {...props}
          className={`w-full h-12 pl-10 pr-4 rounded-xl border text-sm transition focus:outline-none focus:ring-2
            ${
              error
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-green-500"
            }`}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  )
);
