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

const PACKAGES = [
  {
    id: "basic",
    name: "Gói Cơ Bản",
    price: 50000,
    benefits: [
      "Đăng tối đa 3 tin / 30 ngày",
      "Quản lý hồ sơ ứng viên",
      "Hỗ trợ cơ bản",
    ],
  },
  {
    id: "standard",
    name: "Gói Tiêu Chuẩn",
    price: 150000,
    benefits: [
      "Đăng tối đa 10 tin / 30 ngày",
      "Ưu tiên hiển thị tin",
      "Quản lý & lọc hồ sơ",
    ],
  },
  {
    id: "premium",
    name: "Gói Cao Cấp",
    price: 300000,
    benefits: [
      "Đăng tin không giới hạn / 30 ngày",
      "Ưu tiên hiển thị cao nhất",
      "Hỗ trợ 1-1",
    ],
  },
];

export default function EmployerPayment() {
  const [selectedPackage, setSelectedPackage] = useState(PACKAGES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [success, setSuccess] = useState(false);

  // 🔹 Thông tin chuyển tiền (làm cho nó "thật")
  const [transferInfo, setTransferInfo] = useState(null);

  /* =====================
     HANDLE VIETQR PAYMENT
  ===================== */
  const handlePay = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await paymentService.createVietQRPayment(
        selectedPackage.id // 🔥 QUAN TRỌNG
      );

      if (!data?.qrUrl) {
        throw new Error("Missing QR data");
      }

      setQrUrl(data.qrUrl);
      setTransferInfo({
        accountName: data.accountName,
        amount: data.amount,
        content: data.transferContent,
      });

      setConfirm(false);
    } catch (err) {
      console.error(err);
      setError(
        "Không thể khởi tạo thanh toán VietQR. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-3xl p-10 shadow-sm">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center">
            <CreditCard size={26} />
          </div>
          <div>
            <h2 className="text-3xl font-semibold">
              Chọn gói dịch vụ tuyển dụng
            </h2>
            <p className="text-gray-500 mt-1">
              Thanh toán để mở quyền đăng tin cho nhà tuyển dụng
            </p>
          </div>
        </div>

        {/* PACKAGES */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg)}
              className={`cursor-pointer rounded-3xl border p-6 transition ${
                selectedPackage.id === pkg.id
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:border-emerald-300"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">
                {pkg.name}
              </h3>
              <p className="text-2xl font-bold mb-4">
                {pkg.price.toLocaleString("vi-VN")}₫
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                {pkg.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2
                      size={14}
                      className="text-emerald-600"
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* PAYMENT BUTTON */}
        {!qrUrl && (
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Zap size={16} />
              Thanh toán bằng{" "}
              <span className="font-semibold text-emerald-600">
                VietQR
              </span>
            </div>

            <button
              onClick={() => setConfirm(true)}
              className="px-8 py-4 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
            >
              Thanh toán {selectedPackage.price.toLocaleString()}₫
            </button>
          </div>
        )}

        {/* QR + TRANSFER INFO */}
        {qrUrl && !success && (
          <div className="text-center">
            <img
              src={qrUrl}
              alt="VietQR"
              className="mx-auto w-64 h-64 border rounded-2xl"
            />

            {/* THÔNG TIN CHUYỂN TIỀN */}
            {transferInfo && (
              <div className="mt-6 text-sm text-gray-700 space-y-1">
                <p>
                  <b>Người nhận:</b>{" "}
                  {transferInfo.accountName}
                </p>
                <p>
                  <b>Số tiền:</b>{" "}
                  {transferInfo.amount.toLocaleString(
                    "vi-VN"
                  )}
                  ₫
                </p>
                <p>
                  <b>Nội dung:</b>{" "}
                  <span className="font-mono">
                    {transferInfo.content}
                  </span>
                </p>
              </div>
            )}

            <button
              onClick={() => setSuccess(true)}
              className="mt-5 px-6 py-3 bg-emerald-600 text-white rounded-xl"
            >
              Tôi đã thanh toán
            </button>
          </div>
        )}

        {success && (
          <div className="mt-6 flex gap-2 items-center bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-700">
            <CheckCircle2 size={18} />
            Thanh toán đã được ghi nhận. Chờ admin xác nhận
            để mở quyền đăng tin.
          </div>
        )}

        {error && (
          <div className="mt-6 flex gap-2 items-center bg-red-50 border border-red-200 p-4 rounded-xl text-red-700">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500 flex gap-2 items-center">
          <ShieldCheck size={14} />
          Thanh toán VietQR – mô phỏng cho mục đích học thuật
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center">
            <h3 className="font-semibold mb-3">
              Xác nhận thanh toán
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Bạn đang chọn <b>{selectedPackage.name}</b> –{" "}
              {selectedPackage.price.toLocaleString("vi-VN")}₫
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirm(false)}
                className="px-4 py-2 border rounded-xl"
              >
                Hủy
              </button>
              <button
                onClick={handlePay}
                disabled={loading}
                className="px-5 py-2 bg-emerald-600 text-white rounded-xl"
              >
                {loading ? (
                  <Loader2
                    size={16}
                    className="animate-spin inline"
                  />
                ) : (
                  "Tiếp tục"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
