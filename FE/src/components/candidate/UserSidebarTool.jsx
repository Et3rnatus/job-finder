import { useNavigate } from "react-router-dom";

function UserSidebarTool({ onEditProfile }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div
      className="
        bg-white border rounded-xl p-6 mt-6
        shadow-sm
      "
    >
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Quản lý tài khoản
      </h3>

      <ul className="space-y-1 text-sm">
        {/* Cập nhật hồ sơ */}
        <SidebarItem onClick={onEditProfile}>
          ✏️ Cập nhật hồ sơ
        </SidebarItem>

        {/* Công việc đã ứng tuyển */}
        <SidebarItem
          onClick={() => navigate("/candidate/applications")}
        >
          📄 Công việc đã ứng tuyển
        </SidebarItem>

        {/* Công việc đã lưu */}
        <SidebarItem
          onClick={() => navigate("/candidate/saved-jobs")}
        >
          ⭐ Công việc đã lưu
        </SidebarItem>

        {/* Công việc đã xem */}
        <SidebarItem
          onClick={() => navigate("/candidate/viewed-jobs")}
        >
          👀 Công việc đã xem
        </SidebarItem>

        {/* Divider */}
        <div className="my-3 border-t" />

        {/* Disabled */}
        <li
          className="
            px-3 py-2 rounded
            text-gray-400 cursor-not-allowed
          "
        >
          🔒 Đổi mật khẩu
          <span className="block text-xs">
            (Phát triển sau)
          </span>
        </li>

        {/* Logout */}
        <li
          onClick={handleLogout}
          className="
            px-3 py-2 rounded cursor-pointer
            text-red-600 hover:bg-red-50
            font-medium
          "
        >
          🚪 Đăng xuất
        </li>
      </ul>
    </div>
  );
}

function SidebarItem({ children, onClick }) {
  return (
    <li
      onClick={onClick}
      className="
        px-3 py-2 rounded cursor-pointer
        flex items-center gap-2
        text-gray-700 font-medium
        hover:bg-gray-100 transition
      "
    >
      {children}
    </li>
  );
}

export default UserSidebarTool;
