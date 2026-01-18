import {
  CreditCard,
  Clock,
} from "lucide-react";

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-10">
      {/* =====================
          HEADER
      ===================== */}
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <CreditCard size={26} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý thanh toán
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Duyệt và theo dõi các giao dịch thanh toán
          </p>
        </div>
      </div>

      {/* =====================
          CONTENT
      ===================== */}
      <div className="bg-white border border-gray-200 rounded-3xl p-16 shadow-sm text-center">
        <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-base font-semibold text-gray-700">
          Chức năng đang phát triển
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Module thanh toán sẽ được triển khai trong giai đoạn tiếp theo
        </p>
      </div>
    </div>
  );
}
