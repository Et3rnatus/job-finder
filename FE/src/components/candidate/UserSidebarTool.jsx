import {
  UserCog,
  FileText,
  Bookmark,
  Eye,
  Lock,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function UserSidebarTool({
  onEditProfile,
  onChangePassword,
}) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 mt-6 shadow-sm">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
        Quản lý tài khoản
      </h3>

      <ul className="space-y-1 text-sm">
        <SidebarItem
          icon={<UserCog size={16} />}
          onClick={onEditProfile}
        >
          Cập nhật hồ sơ
        </SidebarItem>

        <SidebarItem
          icon={<FileText size={16} />}
          onClick={() =>
            (window.location.href =
              "/candidate/applications")
          }
        >
          Công việc đã ứng tuyển
        </SidebarItem>

        <SidebarItem
          icon={<Bookmark size={16} />}
          onClick={() =>
            (window.location.href =
              "/candidate/saved-jobs")
          }
        >
          Công việc đã lưu
        </SidebarItem>

        <SidebarItem
          icon={<Eye size={16} />}
          onClick={() =>
            (window.location.href =
              "/candidate/viewed-jobs")
          }
        >
          Công việc đã xem
        </SidebarItem>

        <div className="my-4 border-t border-gray-200" />

        <SidebarItem
          icon={<Lock size={16} />}
          onClick={onChangePassword}
        >
          Đổi mật khẩu
        </SidebarItem>

        <li
          onClick={handleLogout}
          className="mt-2 px-3 py-2 rounded-xl flex items-center gap-2 cursor-pointer text-red-600 font-semibold hover:bg-red-50 transition"
        >
          <LogOut size={16} />
          Đăng xuất
        </li>
      </ul>
    </div>
  );
}

function SidebarItem({ icon, children, onClick }) {
  return (
    <li
      onClick={onClick}
      className="group px-3 py-2 rounded-xl cursor-pointer flex items-center justify-between gap-2 transition text-gray-700 hover:bg-gray-100"
    >
      <div className="flex items-center gap-2">
        <span className="text-gray-400 group-hover:text-gray-700 transition">
          {icon}
        </span>
        <span className="font-medium">{children}</span>
      </div>

      <ChevronRight
        size={14}
        className="text-gray-300 group-hover:text-gray-500 transition"
      />
    </li>
  );
}
