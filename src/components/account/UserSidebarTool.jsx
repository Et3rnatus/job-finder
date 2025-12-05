function UserSidebarTool() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Công cụ tài khoản
      </h3>

      <ul className="space-y-3 text-gray-600">
        <li className="cursor-pointer hover:text-blue-600">Cập nhật hồ sơ</li>
        <li className="cursor-pointer hover:text-blue-600">Đổi mật khẩu</li>
        <li className="cursor-pointer hover:text-blue-600">Thông báo</li>
        <li className="cursor-pointer hover:text-blue-600">Bảo mật & quyền riêng tư</li>
        <li className="cursor-pointer hover:text-red-600 font-medium">Đăng xuất</li>
      </ul>
    </div>
  );
}

export default UserSidebarTool;
