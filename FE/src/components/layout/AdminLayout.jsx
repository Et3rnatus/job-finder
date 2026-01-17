import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Layers,
  CreditCard,
  LogOut,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

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
          ? "bg-emerald-100 text-emerald-700"
          : "text-gray-300 hover:bg-gray-800 hover:text-white"
      }
    `;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* =====================
          SIDEBAR
      ===================== */}
      <aside
        className={`
          bg-gray-900 text-white
          flex flex-col
          border-r border-gray-800
          transition-all duration-300
          ${collapsed ? "w-20" : "w-72"}
        `}
      >
        {/* ===== BRAND ===== */}
        <div className="px-4 py-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>

            {!collapsed && (
              <div>
                <h2 className="text-lg font-bold leading-tight">
                  Admin Panel
                </h2>
                <p className="text-xs text-gray-400">
                  System management
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white transition"
            title="Thu gọn"
          >
            <ChevronLeft
              className={`w-5 h-5 transition ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* ===== NAV ===== */}
        <nav className="flex-1 px-3 py-6 space-y-2 text-sm">
          <NavLink to="/admin" end className={navClass}>
            <LayoutDashboard className="w-5 h-5" />
            {!collapsed && "Dashboard"}
          </NavLink>

          <NavLink to="/admin/users" className={navClass}>
            <Users className="w-5 h-5" />
            {!collapsed && "Users"}
          </NavLink>

          <NavLink to="/admin/jobs" className={navClass}>
            <Briefcase className="w-5 h-5" />
            {!collapsed && "Jobs"}
          </NavLink>

          <NavLink to="/admin/categories" className={navClass}>
            <Layers className="w-5 h-5" />
            {!collapsed && "Categories"}
          </NavLink>

          <NavLink to="/admin/payments" className={navClass}>
            <CreditCard className="w-5 h-5" />
            {!collapsed && "Payments"}
          </NavLink>
        </nav>

        {/* ===== FOOTER ===== */}
        <div className="px-3 py-4 border-t border-gray-800">
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
            {!collapsed && "Đăng xuất"}
          </button>
        </div>
      </aside>

      {/* =====================
          MAIN CONTENT
      ===================== */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
