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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        {/* ===== LOGO ===== */}
        <Link
          to="/"
          className="text-2xl font-bold text-green-600 tracking-tight"
        >
          JobFinder
        </Link>

        {/* ===== MAIN MENU ===== */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-green-600 transition">
            Trang chủ
          </Link>
          <Link to="/jobs" className="hover:text-green-600 transition">
            Việc làm
          </Link>
          <Link to="/employers" className="hover:text-green-600 transition">
            Tuyển dụng
          </Link>
          <Link to="/contact" className="hover:text-green-600 transition">
            Liên hệ
          </Link>
          <Link to="/docs" className="hover:text-green-600 transition">
            Tài liệu
          </Link>
        </div>

        {/* ===== ACTIONS ===== */}
        <div className="flex items-center gap-3">
          {!role ? (
            <>
              <Link
                to="/register"
                className="
                  px-4 py-2 rounded-full
                  border border-green-600 text-green-600
                  text-sm font-semibold
                  hover:bg-green-50 transition
                "
              >
                Đăng ký
              </Link>

              <Link
                to="/login"
                className="
                  px-4 py-2 rounded-full
                  bg-green-600 text-white
                  text-sm font-semibold
                  hover:bg-green-700 transition
                "
              >
                Đăng nhập
              </Link>
            </>
          ) : (
            <>
              {/* 🔔 NOTIFICATION (EMPLOYER) */}
              {token && role === "employer" && <NotificationBell />}

              {/* ACCOUNT */}
              <button
                onClick={handleAccountClick}
                className="
                  px-4 py-2 rounded-full
                  bg-gray-100 text-gray-800
                  text-sm font-semibold
                  hover:bg-gray-200 transition
                "
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
