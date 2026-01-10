import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  // (tuỳ chọn) đọc query params nếu cần sau này
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("orderId");

    if (orderId) {
      console.log("PAYMENT SUCCESS ORDER:", orderId);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border rounded-xl p-8 max-w-md w-full text-center space-y-4">
        {/* ICON */}
        <div className="text-5xl">✅</div>

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-gray-800">
          Thanh toán thành công
        </h2>

        {/* DESC */}
        <p className="text-sm text-gray-600">
          Giao dịch của bạn đã được ghi nhận.
          <br />
          Hệ thống đang xử lý và kích hoạt quyền cho tài khoản.
        </p>

        {/* ACTIONS */}
        <div className="pt-4 space-y-2">
          <button
            onClick={() => navigate("/employer")}
            className="w-full px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Quay về trang quản lý
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full px-4 py-2 rounded border text-gray-700 hover:bg-gray-100"
          >
            Về trang chủ
          </button>
        </div>

        {/* NOTE */}
        <p className="text-xs text-gray-400 pt-2">
          Nếu có sự cố, vui lòng liên hệ bộ phận hỗ trợ.
        </p>
      </div>
    </div>
  );
}

export default PaymentSuccess;
