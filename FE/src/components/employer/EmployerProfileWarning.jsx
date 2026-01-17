import {
  AlertTriangle,
  ArrowRight,
  Lock,
  Briefcase,
  CreditCard,
} from "lucide-react";

export default function EmployerProfileWarning({ onEditProfile }) {
  return (
    <div className="mb-10 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-200 rounded-3xl p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        {/* ICON */}
        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shrink-0">
          <AlertTriangle size={28} />
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          <h4 className="text-xl font-semibold text-amber-900 mb-2">
            Hồ sơ doanh nghiệp chưa hoàn thiện
          </h4>

          <p className="text-sm text-amber-800 leading-relaxed max-w-2xl">
            Để đảm bảo tính minh bạch và độ tin cậy cho
            ứng viên, hệ thống yêu cầu doanh nghiệp
            hoàn thiện đầy đủ thông tin trước khi sử
            dụng các chức năng quan trọng.
          </p>

          {/* BLOCKED FEATURES */}
          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm text-amber-900">
            <FeatureItem
              icon={<Briefcase size={16} />}
              text="Đăng tin tuyển dụng"
            />
            <FeatureItem
              icon={<CreditCard size={16} />}
              text="Thanh toán & nâng cấp"
            />
            <FeatureItem
              icon={<Lock size={16} />}
              text="Quản lý ứng viên"
            />
          </div>
        </div>

        {/* ACTION */}
        {onEditProfile && (
          <div className="flex items-center">
            <button
              onClick={onEditProfile}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-900 hover:opacity-90 transition whitespace-nowrap"
            >
              Hoàn thiện hồ sơ
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* =====================
   SUB COMPONENT
===================== */

function FeatureItem({ icon, text }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-100/60 border border-amber-200">
      <span className="text-amber-700">{icon}</span>
      <span className="font-medium">{text}</span>
    </div>
  );
}
