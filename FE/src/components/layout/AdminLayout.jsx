import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Layers,
  CreditCard,
  LogOut,
  ShieldCheck,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `
      flex items-center gap-3
      px-4 py-3 rounded-xl
      font-medium transition
      ${
        isActive
          ? "bg-green-100 text-green-700"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }
    `;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* =====================
          SIDEBAR
      ===================== */}
      <aside
        className="
          w-72 bg-gray-900 text-white
          flex flex-col
          border-r border-gray-800
        "
      >
        {/* ===== BRAND ===== */}
        <div className="px-6 py-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div
              className="
                w-10 h-10 rounded-xl
                bg-green-600 text-white
                flex items-center justify-center
              "
            >
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">
                Admin Panel
              </h2>
              <p className="text-xs text-gray-400">
                System management
              </p>
            </div>
          </div>
        </div>

        {/* ===== NAV ===== */}
        <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
          <NavLink to="/admin" end className={navClass}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>

          <NavLink to="/admin/users" className={navClass}>
            <Users className="w-5 h-5" />
            Users
          </NavLink>

          <NavLink to="/admin/jobs" className={navClass}>
            <Briefcase className="w-5 h-5" />
            Jobs
          </NavLink>

          <NavLink to="/admin/categories" className={navClass}>
            <Layers className="w-5 h-5" />
            Categories
          </NavLink>

          <NavLink to="/admin/payments" className={navClass}>
            <CreditCard className="w-5 h-5" />
            Payments
          </NavLink>
        </nav>

        {/* ===== FOOTER ===== */}
        <div className="px-4 py-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="
              flex items-center gap-3
              w-full px-4 py-3
              text-sm font-medium
              text-red-400
              rounded-xl
              hover:bg-red-500/10 hover:text-red-300
              transition
            "
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* =====================
          MAIN CONTENT
      ===================== */}
      <main
        className="
          flex-1
          p-6 md:p-8
          overflow-y-auto
        "
      >
        <Outlet />
      </main>
    </div>
  );
}
