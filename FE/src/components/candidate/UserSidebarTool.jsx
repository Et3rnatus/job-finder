import { useNavigate } from "react-router-dom";

function UserSidebarTool({ onEditProfile }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Quản lý tài khoản
      </h3>

      <ul className="space-y-2 text-sm">
        <li
          onClick={onEditProfile}
          className="px-3 py-2 rounded cursor-pointer text-gray-700 hover:bg-gray-100"
        >
          Cập nhật hồ sơ
        </li>

        <li className="px-3 py-2 rounded cursor-pointer text-gray-700 hover:bg-gray-100">
          Đổi mật khẩu
        </li>

        <li className="px-3 py-2 rounded cursor-pointer text-gray-700 hover:bg-gray-100">
          Thông báo
        </li>

        <li className="px-3 py-2 rounded cursor-pointer text-gray-700 hover:bg-gray-100">
          Bảo mật & quyền riêng tư
        </li>

        <li
          onClick={handleLogout}
          className="px-3 py-2 rounded cursor-pointer text-red-600 hover:bg-red-50 font-medium"
        >
          Đăng xuất
        </li>
      </ul>
    </div>
  );
}

export default UserSidebarTool;
