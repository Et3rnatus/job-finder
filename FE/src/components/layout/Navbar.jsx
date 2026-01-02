import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const handleAccountClick = () => {
    if (role === "candidate") {
      navigate("/account/candidate");
    } else if (role === "employer") {
      navigate("/account/employer");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          JobFinder
        </Link>

        {/* MENU */}
        <div className="hidden md:flex gap-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
          <Link to="/jobs" className="hover:text-blue-600">Việc làm</Link>
          <Link to="/employers" className="hover:text-blue-600">Tuyển dụng</Link>
          <Link to="/contact" className="hover:text-blue-600">Liên hệ</Link>
          <Link to="/docs" className="hover:text-blue-600">Tài liệu</Link>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-4">
          {!role ? (
            <>
              <Link
                to="/register"
                className="border border-green-600 rounded-full px-4 py-2 text-green-600 hover:bg-green-100 font-semibold"
              >
                Đăng ký
              </Link>

              <Link
                to="/login"
                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 font-semibold"
              >
                Đăng nhập
              </Link>
            </>
          ) : (
            <>
              {/* 🔔 NOTIFICATION BELL */}
              {token && <NotificationBell />}

              <button
                onClick={handleAccountClick}
                className="bg-gray-100 text-black px-4 py-2 rounded-full hover:bg-gray-200 font-semibold"
              >
                Quản lý tài khoản
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
