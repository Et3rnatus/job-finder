import { useNavigate } from "react-router-dom";

function EmployerSideBarTool({
  setMode,
  setProfileMode,
  currentMode,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    sessionStorage.removeItem("employerProfileModalShown");
    navigate("/login");
  };

  const menuClass = (mode) =>
    `
      flex items-center gap-3
      px-4 py-3 rounded-lg cursor-pointer
      transition font-medium
      ${
        currentMode === mode
          ? "bg-green-100 text-green-700"
          : "text-gray-700 hover:bg-gray-100"
      }
    `;

  return (
    <div className="bg-white border rounded-xl p-6 mt-6">
      {/* HEADER */}
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Quản lý tuyển dụng
      </h3>

      <ul className="space-y-1 text-sm">
        {/* ===== PROFILE ===== */}
        <li
          onClick={() => {
            setMode("profile");
            setProfileMode?.("view");
          }}
          className={menuClass("profile")}
        >
          <span className="text-lg">🏢</span>
          Hồ sơ công ty
        </li>

        {/* ===== JOBS ===== */}
        <li
          onClick={() => setMode("jobs")}
          className={menuClass("jobs")}
        >
          <span className="text-lg">📄</span>
          Việc làm đã đăng
        </li>

        {/* ===== CREATE JOB ===== */}
        <li
          onClick={() => setMode("create")}
          className={menuClass("create")}
        >
          <span className="text-lg">➕</span>
          Đăng tuyển mới
        </li>

        {/* ===== PAYMENT ===== */}
        <li
          onClick={() => setMode("payment")}
          className={menuClass("payment")}
        >
          <span className="text-lg">💳</span>
          Nâng cấp tài khoản
        </li>

        {/* DIVIDER */}
        <div className="my-3 border-t" />

        {/* ===== LOGOUT ===== */}
        <li
          onClick={handleLogout}
          className="
            flex items-center gap-3
            px-4 py-3 rounded-lg cursor-pointer
            text-red-600 hover:bg-red-50
            font-medium transition
          "
        >
          <span className="text-lg">🚪</span>
          Đăng xuất
        </li>
      </ul>
    </div>
  );
}

export default EmployerSideBarTool;
