import { useEffect, useState } from "react";
import { getPayments, approvePayment } from "../../services/adminService";

function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await getPayments();
      setPayments(data);
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
      alert("Đã duyệt thanh toán");
      fetchPayments();
    } catch (error) {
      console.error("APPROVE PAYMENT ERROR:", error);
      alert("Duyệt thất bại");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Quản lý thanh toán
      </h1>

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Số tiền</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-4 py-3 text-left">Thời gian</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center">
                  Đang tải...
                </td>
              </tr>
            )}

            {!loading && payments.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-6 text-center text-gray-500"
                >
                  Chưa có giao dịch nào
                </td>
              </tr>
            )}

            {payments.map((p) => (
              <tr key={p.orderId} className="border-t">
                <td className="px-4 py-3">{p.orderId}</td>
                <td className="px-4 py-3">{p.amount} VNĐ</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium
                      ${
                        p.status === "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    `}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(p.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center">
                  {p.status === "PENDING" ? (
                    <button
                      onClick={() => handleApprove(p.orderId)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Duyệt
                    </button>
                  ) : (
                    <span className="text-gray-400">Đã duyệt</span>
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

export default AdminPaymentsPage;
