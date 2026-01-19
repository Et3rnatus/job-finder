import { useEffect, useState } from "react";
import paymentService from "../../services/paymentService";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Calendar,
} from "lucide-react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    const data = await paymentService.getAllPayments();
    setPayments(data);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleApprove = async (orderId) => {
    setLoading(true);
    await paymentService.approvePayment(orderId);
    await fetchPayments();
    setLoading(false);
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const isExpired = (expiredAt) => {
    if (!expiredAt) return false;
    return new Date(expiredAt) < new Date();
  };

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
            Theo dõi gói dịch vụ và hạn sử dụng
          </p>
        </div>
      </div>

      {/* =====================
          TABLE
      ===================== */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 text-left">
                Mã giao dịch
              </th>
              <th className="px-6 py-4 text-left">
                Gói
              </th>
              <th className="px-6 py-4 text-left">
                Số tiền
              </th>
              <th className="px-6 py-4 text-left">
                Ngày duyệt
              </th>
              <th className="px-6 py-4 text-left">
                Hạn sử dụng
              </th>
              <th className="px-6 py-4 text-left">
                Tình trạng
              </th>
              <th className="px-6 py-4 text-right">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody>
            {payments.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="py-16 text-center text-gray-400"
                >
                  <Clock className="w-10 h-10 mx-auto mb-3" />
                  Chưa có giao dịch nào
                </td>
              </tr>
            )}

            {payments.map((p) => {
              const expired = isExpired(p.expiredAt);

              return (
                <tr
                  key={p.orderId}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-mono text-xs">
                    {p.orderId}
                  </td>

                  <td className="px-6 py-4">
                    {p.packageName}
                  </td>

                  <td className="px-6 py-4">
                    {p.amount.toLocaleString("vi-VN")}₫
                  </td>

                  <td className="px-6 py-4">
                    {formatDate(p.approvedAt)}
                  </td>

                  <td className="px-6 py-4">
                    {formatDate(p.expiredAt)}
                  </td>

                  <td className="px-6 py-4">
                    {p.status !== "SUCCESS" && (
                      <span className="inline-flex items-center gap-1 text-yellow-600 font-semibold">
                        <Clock size={14} />
                        Chờ duyệt
                      </span>
                    )}

                    {p.status === "SUCCESS" && !expired && (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                        <CheckCircle2 size={14} />
                        Còn hạn
                      </span>
                    )}

                    {p.status === "SUCCESS" && expired && (
                      <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                        <Calendar size={14} />
                        Hết hạn
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    {p.status === "PENDING" && (
                      <button
                        onClick={() =>
                          handleApprove(p.orderId)
                        }
                        disabled={loading}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                      >
                        <CheckCircle2 size={14} />
                        Duyệt
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
