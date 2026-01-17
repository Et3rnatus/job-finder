import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("orderId");
    if (id) {
      setOrderId(id);
      console.log("PAYMENT SUCCESS ORDER:", id);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        {/* ICON */}
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-gray-900">
          Thanh toán thành công
        </h2>

        {/* DESC */}
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">
          Giao dịch của bạn đã được ghi nhận thành công.
          <br />
          Hệ thống sẽ tự động kích hoạt quyền sử dụng cho
          tài khoản nhà tuyển dụng.
        </p>

        {/* ORDER ID */}
        {orderId && (
          <div className="mt-4 text-sm bg-gray-50 border rounded-xl px-4 py-2 text-gray-700">
            <span className="text-gray-500">Mã giao dịch:</span>{" "}
            <span className="font-semibold">{orderId}</span>
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => navigate("/employer")}
            className="
              w-full inline-flex items-center justify-center gap-2
              px-6 py-3 rounded-xl
              bg-green-600 text-white
              font-semibold
              hover:bg-green-700
              transition
            "
          >
            Quay về trang quản lý
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => navigate("/")}
            className="
              w-full inline-flex items-center justify-center gap-2
              px-6 py-3 rounded-xl
              border border-gray-300
              text-gray-700
              font-semibold
              hover:bg-gray-100
              transition
            "
          >
            <Home size={16} />
            Về trang chủ
          </button>
        </div>

        {/* FOOT NOTE */}
        <p className="text-xs text-gray-400 mt-6">
          Nếu có bất kỳ sự cố nào, vui lòng liên hệ bộ phận hỗ trợ
          để được trợ giúp kịp thời.
        </p>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
