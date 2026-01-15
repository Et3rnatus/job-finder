import { useState } from "react";
import paymentService from "../../services/paymentService";
import {
  CreditCard,
  ShieldCheck,
  Zap,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function EmployerPayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePay = async () => {
    try {
      setLoading(true);
      setError(null);

      const data =
        await paymentService.createMoMoPayment(50000);

      if (!data?.payUrl) {
        throw new Error("Không nhận được URL thanh toán");
      }

      window.location.href = data.payUrl;
    } catch (err) {
      setError(
        "Có lỗi xảy ra khi khởi tạo thanh toán. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-3xl p-10 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-md">
          <CreditCard size={26} />
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-gray-900">
            Nâng cấp tài khoản nhà tuyển dụng
          </h2>
          <p className="text-gray-500 mt-1">
            Mở khóa toàn bộ tính năng tuyển dụng chuyên nghiệp
          </p>
        </div>
      </div>

      {/* PACKAGE */}
      <div className="relative overflow-hidden border border-gray-200 rounded-3xl p-8 mb-10 bg-gradient-to-br from-white to-pink-50">
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-700">
          Phổ biến nhất
        </div>

        <div className="flex flex-wrap justify-between gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Gói Cơ Bản
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                Đăng tin tuyển dụng không giới hạn
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                Quản lý & duyệt hồ sơ ứng viên
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                Thống kê & theo dõi hiệu quả tuyển dụng
              </li>
            </ul>
          </div>

          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">
              50.000₫
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Thanh toán một lần
            </p>
          </div>
        </div>
      </div>

      {/* PAYMENT */}
      <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
            <Zap size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              Phương thức thanh toán
            </p>
            <p className="text-xs text-gray-500">
              Ví điện tử <span className="font-semibold text-pink-600">MoMo</span>
            </p>
          </div>
        </div>

        <button
          onClick={handlePay}
          disabled={loading}
          className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-90"
          }`}
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? "Đang xử lý..." : "Thanh toán MoMo"}
        </button>
      </div>

      {/* SECURITY */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <ShieldCheck size={14} />
        Giao dịch được bảo mật và xử lý trực tiếp qua MoMo
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}
    </div>
  );
}
