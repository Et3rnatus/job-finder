import { useState } from "react";
import paymentService from "../../services/paymentService";

function EmployerPayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePay = async () => {
    try {
      setLoading(true);
      setError(null);

      // 👉 Gọi qua service (FE → BE)
      const data = await paymentService.createMoMoPayment(50000);

      if (!data || !data.payUrl) {
        throw new Error("Không nhận được URL thanh toán");
      }

      // 🔥 Redirect sang cổng MoMo
      window.location.href = data.payUrl;
    } catch (err) {
      console.error("PAYMENT ERROR:", err);
      setError(
        "Có lỗi xảy ra khi khởi tạo thanh toán. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6 space-y-5">
      {/* =====================
          HEADER
      ===================== */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Thanh toán & Nâng cấp tài khoản
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Thanh toán để kích hoạt các tính năng dành cho nhà tuyển dụng
        </p>
      </div>

      {/* =====================
          PACKAGE INFO
      ===================== */}
      <div className="border rounded-lg p-4 flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-800">Gói cơ bản</p>
          <p className="text-sm text-gray-500 mt-1">
            Đăng tin tuyển dụng và quản lý ứng viên
          </p>
        </div>

        <div className="text-right">
          <p className="text-lg font-semibold text-gray-800">
            50.000 VNĐ
          </p>
          <p className="text-xs text-gray-500">
            Thanh toán 1 lần
          </p>
        </div>
      </div>

      {/* =====================
          ACTION
      ===================== */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Phương thức:{" "}
          <span className="font-medium text-pink-600">MoMo</span>
        </div>

        <button
          onClick={handlePay}
          disabled={loading}
          className={`px-5 py-2 rounded text-white font-medium
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-pink-600 hover:bg-pink-700"
            }
          `}
        >
          {loading ? "Đang xử lý..." : "Thanh toán MoMo"}
        </button>
      </div>

      {/* =====================
          ERROR
      ===================== */}
      {error && (
        <div className="text-sm text-red-600 border border-red-300 bg-red-50 rounded p-3">
          {error}
        </div>
      )}
    </div>
  );
}

export default EmployerPayment;
