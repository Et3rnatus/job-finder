import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `block px-3 py-2 rounded hover:bg-gray-700 ${
      isActive ? "bg-gray-700 font-semibold" : ""
    }`;

  return (
    <div className="flex min-h-screen">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-6">ADMIN PANEL</h2>

        <nav className="space-y-2 flex-1">
  <NavLink to="/admin" end className={navClass}>
    Dashboard
  </NavLink>

  <NavLink to="/admin/users" className={navClass}>
    Users
  </NavLink>

  <NavLink to="/admin/jobs" className={navClass}>
    Jobs
  </NavLink>

  {/* ⭐ NEW: CATEGORY MANAGEMENT */}
  <NavLink
    to="/admin/categories"
    className={navClass}
  >
    Categories
  </NavLink>
</nav>


        {/* ===== LOGOUT ===== */}
        <button
          onClick={handleLogout}
          className="mt-6 text-sm text-red-400 hover:text-red-300 text-left"
        >
          Logout
        </button>
      </aside>

      {/* ===== CONTENT ===== */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
