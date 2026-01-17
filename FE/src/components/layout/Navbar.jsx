import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import NotificationBell from "./NotificationBell";
import {
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  Settings,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [openMenu, setOpenMenu] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const accountRef = useRef(null);

  const handleAccountClick = () => {
    setOpenAccount((v) => !v);
  };

  const handleGoAccount = () => {
    if (role === "candidate") {
      navigate("/account/candidate");
    } else if (role === "employer") {
      navigate("/account/employer");
    } else {
      navigate("/login");
    }
    setOpenAccount(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  /* CLOSE DROPDOWN WHEN CLICK OUTSIDE */
  useEffect(() => {
    const onClick = (e) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(e.target)
      ) {
        setOpenAccount(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () =>
      document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        {/* =====================
            LEFT – LOGO
        ===================== */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="
              text-2xl font-extrabold tracking-tight
              text-emerald-600 hover:text-emerald-700
              transition
            "
          >
            JobFinder
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {openMenu ? <X /> : <Menu />}
          </button>
        </div>

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
        <div className="flex items-center gap-3 relative">
          {!role ? (
            <>
              {/* REGISTER */}
              <Link
                to="/register"
                className="
                  px-4 py-2 rounded-full
                  border border-emerald-600 text-emerald-600
                  text-sm font-semibold
                  hover:bg-emerald-50
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
                  bg-emerald-600 text-white
                  text-sm font-semibold
                  hover:bg-emerald-700
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

              {/* ACCOUNT DROPDOWN */}
              <div ref={accountRef} className="relative">
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
                  <ChevronDown
                    className={`w-4 h-4 opacity-60 transition ${
                      openAccount ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openAccount && (
                  <div
                    className="
                      absolute right-0 mt-2 w-48
                      bg-white border border-gray-200
                      rounded-xl shadow-lg
                      overflow-hidden
                    "
                  >
                    <DropdownItem onClick={handleGoAccount}>
                      <User size={16} />
                      Trang cá nhân
                    </DropdownItem>

                    <DropdownItem onClick={() => navigate("/settings")}>
                      <Settings size={16} />
                      Cài đặt
                    </DropdownItem>

                    <div className="border-t" />

                    <DropdownItem danger onClick={handleLogout}>
                      <LogOut size={16} />
                      Đăng xuất
                    </DropdownItem>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* =====================
          MOBILE MENU
      ===================== */}
      {openMenu && (
        <div className="md:hidden border-t bg-white px-6 py-4 space-y-3 text-sm font-medium">
          <NavItem to="/">Trang chủ</NavItem>
          <NavItem to="/jobs">Việc làm</NavItem>
          <NavItem to="/employers">Nhà tuyển dụng</NavItem>
          <NavItem to="/contact">Liên hệ</NavItem>
          <NavItem to="/docs">Tài liệu</NavItem>
        </div>
      )}
    </nav>
  );
}

/* =====================
   SUB COMPONENTS
===================== */

function NavItem({ to, children }) {
  return (
    <Link
      to={to}
      className="
        relative block
        hover:text-emerald-600
        transition
        after:absolute after:left-0 after:-bottom-1
        after:h-0.5 after:w-0 after:bg-emerald-600
        after:transition-all
        hover:after:w-full
      "
    >
      {children}
    </Link>
  );
}

function DropdownItem({ children, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-2
        px-4 py-3 text-sm text-left
        transition
        ${
          danger
            ? "text-red-500 hover:bg-red-50"
            : "text-gray-700 hover:bg-gray-100"
        }
      `}
    >
      {children}
    </button>
  );
}

export default Navbar;
