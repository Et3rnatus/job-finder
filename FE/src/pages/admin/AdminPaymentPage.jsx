import { useEffect, useState } from "react";
import {
  getPayments,
  approvePayment,
} from "../../services/adminService";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await getPayments();
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("FETCH PAYMENTS ERROR:", error);
      alert("Không thể tải danh sách thanh toán");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleApprove = async (orderId) => {
    const ok = window.confirm("Xác nhận duyệt thanh toán?");
    if (!ok) return;

    try {
      await approvePayment(orderId);
      fetchPayments();
    } catch (error) {
      console.error("APPROVE PAYMENT ERROR:", error);
      alert("Duyệt thất bại");
    }
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex items-center gap-4">
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

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-gray-600">
              <th className="px-6 py-4 text-left">
                Order ID
              </th>
              <th className="px-6 py-4 text-left">
                Số tiền
              </th>
              <th className="px-6 py-4 text-left">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-left">
                Thời gian
              </th>
              <th className="px-6 py-4 text-center">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <Loader2
                    size={20}
                    className="inline animate-spin mr-2"
                  />
                  Đang tải dữ liệu...
                </td>
              </tr>
            )}

            {!loading && payments.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Chưa có giao dịch nào
                </td>
              </tr>
            )}

            {payments.map((p) => (
              <tr
                key={p.orderId}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {p.orderId}
                </td>

                <td className="px-6 py-4">
                  {Number(p.amount).toLocaleString()} VNĐ
                </td>

                <td className="px-6 py-4">
                  {p.status === "SUCCESS" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      <CheckCircle2 size={12} />
                      Đã duyệt
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                      <Clock size={12} />
                      Chờ duyệt
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {new Date(p.createdAt).toLocaleString(
                    "vi-VN"
                  )}
                </td>

                <td className="px-6 py-4 text-center">
                  {p.status === "PENDING" ? (
                    <button
                      onClick={() =>
                        handleApprove(p.orderId)
                      }
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition"
                    >
                      <ShieldCheck size={14} />
                      Duyệt
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      —
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
