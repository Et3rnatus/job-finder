import { useNavigate } from "react-router-dom";
import {
  Building2,
  Briefcase,
  PlusCircle,
  CreditCard,
  LogOut,
} from "lucide-react";

export default function EmployerSideBarTool({
  setMode,
  setProfileMode,
  currentMode,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    sessionStorage.removeItem(
      "employerProfileModalShown"
    );
    navigate("/login");
  };

  const isActive = (mode) => currentMode === mode;

  const Item = ({ icon, label, mode, onClick }) => (
    <li
      onClick={onClick}
      className={`group flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition ${
        isActive(mode)
          ? "bg-emerald-50 text-emerald-700"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`transition ${
            isActive(mode)
              ? "text-emerald-600"
              : "text-gray-400 group-hover:text-gray-700"
          }`}
        >
          {icon}
        </span>
        <span className="font-semibold">
          {label}
        </span>
      </div>
    </li>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 mt-6 shadow-sm">
      {/* HEADER */}
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-6">
        Quản lý tuyển dụng
      </h3>

      <ul className="space-y-1 text-sm">
        <Item
          icon={<Building2 size={18} />}
          label="Hồ sơ công ty"
          mode="profile"
          onClick={() => {
            setMode("profile");
            setProfileMode?.("view");
          }}
        />

        <Item
          icon={<Briefcase size={18} />}
          label="Việc làm đã đăng"
          mode="jobs"
          onClick={() => setMode("jobs")}
        />

        <Item
          icon={<PlusCircle size={18} />}
          label="Đăng tuyển mới"
          mode="create"
          onClick={() => setMode("create")}
        />

        <Item
          icon={<CreditCard size={18} />}
          label="Nâng cấp tài khoản"
          mode="payment"
          onClick={() => setMode("payment")}
        />

        <div className="my-5 border-t border-gray-200" />

        <li
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer text-red-600 font-semibold hover:bg-red-50 transition"
        >
          <LogOut size={18} />
          Đăng xuất
        </li>
      </ul>
    </div>
  );
}
