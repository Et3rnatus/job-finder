import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../../services/authService";  

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });

      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);

      alert("Đăng nhập thành công!");
      navigate("/");
    }
    catch (error) {
      alert("Email hoặc mật khẩu không đúng.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 my-40 bg-white p-10 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Chào mừng bạn quay trở lại
      </h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Nhập email của bạn"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Nhập mật khẩu"
          />
        </div>

        <div className="text-right text-sm text-blue-600 hover:underline cursor-pointer">
          Quên mật khẩu?
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition font-semibold"
        >
          Đăng nhập
        </button>
        <div className="text-center text-sm mt-4">
          <span className="text-gray-700">Bạn chưa có tài khoản? </span>
          <Link to="/register" className="text-blue-600 hover:underline">
            Đăng ký
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
