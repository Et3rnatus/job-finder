import { useNavigate, useLocation } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();

  /* =====================
     LOGOUT
  ===================== */
  const handleLogout = () => {
    if (!window.confirm("Bạn có chắc chắn muốn đăng xuất?")) return;

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 mt-6 shadow-sm">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
        Quản lý tài khoản
      </h3>

      <ul className="space-y-1 text-sm">
        <SidebarItem
          icon={<UserCog size={16} />}
          active={false}
          onClick={onEditProfile}
        >
          Cập nhật hồ sơ
        </SidebarItem>

        <SidebarItem
          icon={<FileText size={16} />}
          active={location.pathname.includes("/candidate/applications")}
          onClick={() => navigate("/candidate/applications")}
        >
          Công việc đã ứng tuyển
        </SidebarItem>

        <SidebarItem
          icon={<Bookmark size={16} />}
          active={location.pathname.includes("/candidate/saved-jobs")}
          onClick={() => navigate("/candidate/saved-jobs")}
        >
          Công việc đã lưu
        </SidebarItem>

        <SidebarItem
          icon={<Eye size={16} />}
          active={location.pathname.includes("/candidate/viewed-jobs")}
          onClick={() => navigate("/candidate/viewed-jobs")}
        >
          Công việc đã xem
        </SidebarItem>

        <div className="my-4 border-t border-gray-200" />

        <SidebarItem
          icon={<Lock size={16} />}
          active={false}
          onClick={onChangePassword}
        >
          Đổi mật khẩu
        </SidebarItem>

        {/* LOGOUT */}
        <li
          onClick={handleLogout}
          className="mt-2 px-3 py-2 rounded-xl flex items-center gap-2 cursor-pointer text-red-600 font-semibold hover:bg-red-50 transition"
        >
          <LogOut size={16} />
          <span>Đăng xuất</span>
        </li>
      </ul>
    </div>
  );
}

/* =====================
   SUB COMPONENT
===================== */

function SidebarItem({
  icon,
  children,
  onClick,
  active,
}) {
  return (
    <li
      onClick={onClick}
      className={`
        group px-3 py-2 rounded-xl
        cursor-pointer transition
        flex items-start
        ${
          active
            ? "bg-indigo-50 text-indigo-700"
            : "text-gray-700 hover:bg-gray-100"
        }
      `}
    >
      {/* LEFT */}
      <div className="flex items-start gap-2">
        <span
          className={`mt-0.5 transition ${
            active
              ? "text-indigo-600"
              : "text-gray-400 group-hover:text-gray-700"
          }`}
        >
          {icon}
        </span>

        <span className="font-medium leading-snug break-words">
          {children}
        </span>
      </div>

      {/* RIGHT – luôn căn giữa item */}
      <ChevronRight
        size={14}
        className={`ml-auto self-center transition ${
          active
            ? "text-indigo-500"
            : "text-gray-300 group-hover:text-gray-500"
        }`}
      />
    </li>
  );
}
