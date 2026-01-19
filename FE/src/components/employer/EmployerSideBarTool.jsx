import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Building2,
  Briefcase,
  PlusCircle,
  CreditCard,
  LogOut,
  ChevronRight,
  Receipt,
  Package,
} from "lucide-react";

import employerService from "../../services/employerService";

export default function EmployerSideBarTool({
  setMode,
  setProfileMode,
  currentMode,
}) {
  const navigate = useNavigate();
  const [packageStatus, setPackageStatus] = useState(null);

  // fallback cho logic cũ
  const isPremium = localStorage.getItem("is_premium") === "1";

  useEffect(() => {
    employerService
      .getPackageStatus()
      .then(setPackageStatus)
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("is_premium");
    sessionStorage.removeItem("employerProfileModalShown");
    navigate("/login");
  };

  const isActive = (mode) => currentMode === mode;

  const Item = ({
    icon,
    label,
    mode,
    onClick,
    badge,
    disabled = false,
  }) => (
    <li
      onClick={disabled ? undefined : onClick}
      className={`group flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer"
      } ${
        isActive(mode)
          ? "bg-emerald-50 text-emerald-700 shadow-sm"
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

        <span className="font-semibold">{label}</span>

        {badge && (
          <span
            className={`ml-2 px-2 py-0.5 text-[10px] font-semibold rounded-full ${
              badge.type === "danger"
                ? "bg-red-100 text-red-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>

      <ChevronRight
        size={14}
        className={`transition ${
          isActive(mode)
            ? "text-emerald-500"
            : "text-gray-300 group-hover:text-gray-500"
        }`}
      />
    </li>
  );

  /* =====================
     BADGE CHO ĐĂNG TIN
  ===================== */
  let quotaBadge = null;
  if (packageStatus?.currentPackage) {
    if (!packageStatus.currentPackage.isActive) {
      quotaBadge = { text: "Hết hạn", type: "danger" };
    } else if (packageStatus.job_post_limit === -1) {
      quotaBadge = { text: "Không giới hạn" };
    } else {
      quotaBadge = {
        text: `Còn ${packageStatus.remaining_posts} tin`,
      };
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 mt-6 shadow-sm">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-6">
        Quản lý tuyển dụng
      </h3>

      <ul className="space-y-1 text-sm">
        {/* PROFILE */}
        <Item
          icon={<Building2 size={18} />}
          label="Hồ sơ công ty"
          mode="profile"
          badge={{ text: "Bắt buộc" }}
          onClick={() => {
            setMode("profile");
            setProfileMode?.("view");
          }}
        />

        {/* JOB LIST */}
        <Item
          icon={<Briefcase size={18} />}
          label="Việc làm đã đăng"
          mode="jobs"
          onClick={() => setMode("jobs")}
        />

        {/* CREATE JOB */}
        <Item
          icon={<PlusCircle size={18} />}
          label="Đăng tuyển mới"
          mode="create"
          badge={
            !isPremium
              ? { text: "Cần nâng cấp", type: "danger" }
              : quotaBadge
          }
          onClick={() => {
            if (!isPremium) {
              setMode("payment");
              return;
            }
            setMode("create");
          }}
        />

        {/* PACKAGE SUMMARY (NÚT – ĐÚNG Ý MÀY) */}
        <Item
          icon={<Package size={18} />}
          label="Gói đang sử dụng"
          mode="package"
          onClick={() => setMode("package")}
        />

        {/* PAYMENT */}
        <Item
          icon={<CreditCard size={18} />}
          label="Nâng cấp tài khoản"
          mode="payment"
          badge={{ text: "Pro" }}
          onClick={() => setMode("payment")}
        />

        {/* PAYMENT HISTORY */}
        <Item
          icon={<Receipt size={18} />}
          label="Lịch sử thanh toán"
          mode="payment-history"
          onClick={() => setMode("payment-history")}
        />

        <div className="my-5 border-t border-gray-200" />

        {/* LOGOUT */}
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
