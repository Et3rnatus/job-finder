import { AlertTriangle, ArrowRight } from "lucide-react";

export default function EmployerProfileWarning({ onEditProfile }) {
  return (
    <div className="mb-10 flex flex-col md:flex-row md:items-center gap-5 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-200 rounded-3xl p-8 shadow-sm">
      {/* ICON */}
      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shrink-0">
        <AlertTriangle size={28} />
      </div>

      {/* CONTENT */}
      <div className="flex-1">
        <h4 className="text-xl font-semibold text-amber-900 mb-1">
          Hồ sơ doanh nghiệp chưa hoàn thiện
        </h4>
        <p className="text-sm text-amber-800 leading-relaxed max-w-2xl">
          Vui lòng hoàn thiện hồ sơ doanh nghiệp để có
          thể đăng tin tuyển dụng, thanh toán và sử
          dụng đầy đủ các chức năng của hệ thống.
        </p>
      </div>

      {/* ACTION */}
      {onEditProfile && (
        <button
          onClick={onEditProfile}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-900 hover:opacity-90 transition whitespace-nowrap"
        >
          Hoàn thiện ngay
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}
