import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import { ChevronDown } from "lucide-react";

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
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        {/* =====================
            LEFT – LOGO
        ===================== */}
        <Link
          to="/"
          className="
            text-2xl font-bold tracking-tight
            text-green-600 hover:text-green-700
            transition
          "
        >
          JobFinder
        </Link>

        {/* =====================
            CENTER – MAIN MENU
        ===================== */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <NavItem to="/">Trang chủ</NavItem>
          <NavItem to="/jobs">Việc làm</NavItem>
          <NavItem to="/employers">Nhà tuyển dụng</NavItem>
          <NavItem to="/contact">Liên hệ</NavItem>
          <NavItem to="/docs">Tài liệu</NavItem>
        </div>

        {/* =====================
            RIGHT – ACTIONS
        ===================== */}
        <div className="flex items-center gap-3">
          {!role ? (
            <>
              {/* REGISTER */}
              <Link
                to="/register"
                className="
                  px-4 py-2 rounded-full
                  border border-green-600 text-green-600
                  text-sm font-semibold
                  hover:bg-green-50
                  transition
                "
              >
                Đăng ký
              </Link>

              {/* LOGIN */}
              <Link
                to="/login"
                className="
                  px-4 py-2 rounded-full
                  bg-green-600 text-white
                  text-sm font-semibold
                  hover:bg-green-700
                  active:scale-[0.98]
                  transition
                "
              >
                Đăng nhập
              </Link>
            </>
          ) : (
            <>
              {/* NOTIFICATION */}
              {token && <NotificationBell />}

              {/* ACCOUNT */}
              <button
                onClick={handleAccountClick}
                className="
                  flex items-center gap-2
                  px-4 py-2 rounded-full
                  bg-gray-100 text-gray-800
                  text-sm font-semibold
                  hover:bg-gray-200
                  transition
                "
              >
                <span>Quản lý</span>
                <ChevronDown className="w-4 h-4 opacity-60" />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

/* =====================
   SUB COMPONENT
===================== */

function NavItem({ to, children }) {
  return (
    <Link
      to={to}
      className="
        relative
        hover:text-green-600
        transition
        after:absolute after:left-0 after:-bottom-1
        after:h-0.5 after:w-0 after:bg-green-600
        after:transition-all
        hover:after:w-full
      "
    >
      {children}
    </Link>
  );
}

export default Navbar;
