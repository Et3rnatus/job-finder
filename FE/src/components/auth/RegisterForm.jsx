import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { register } from "../../services/authService";

function RegisterForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "candidate",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
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

    // 🔁 Focus input lỗi đầu tiên
    if (newErrors.email) emailRef.current?.focus();
    else if (newErrors.password) passwordRef.current?.focus();
    else if (newErrors.confirmPassword)
      confirmPasswordRef.current?.focus();

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      const { confirmPassword, ...data } = form;
      await register(data);

      setModalTitle("Đăng ký thành công");
      setModalMessage("Vui lòng đăng nhập để tiếp tục.");
    } catch (err) {
      setModalTitle("Đăng ký thất bại");
      setModalMessage(
        err.response?.data?.message || "Email đã tồn tại hoặc lỗi server"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[600px] bg-white p-12 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Tạo tài khoản mới
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              ref={emailRef}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2
                ${
                  errors.email
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-green-500"
                }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              ref={passwordRef}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Tạo mật khẩu"
              className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2
                ${
                  errors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-green-500"
                }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nhập lại mật khẩu
            </label>
            <input
              ref={confirmPasswordRef}
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2
                ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-green-500"
                }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* ROLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại tài khoản
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="candidate">Ứng viên</option>
              <option value="employer">Nhà tuyển dụng</option>
            </select>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded font-semibold transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Bạn đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>

      {/* MODAL */}
      {modalMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {modalTitle}
            </h3>
            <p className="text-gray-600 mb-6">{modalMessage}</p>
            <button
              onClick={() => {
                setModalMessage("");
                if (modalTitle === "Đăng ký thành công") {
                  navigate("/login");
                }
              }}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterForm;
