import { useEffect, useState } from "react";
import employerService from "../../services/employerService";
import { CreditCard, Calendar, Clock } from "lucide-react";

export default function EmployerPaymentHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await employerService.getPaymentHistory();
        setHistory(res.history || []);
      } catch (error) {
        console.error("FETCH PAYMENT HISTORY ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <p className="text-gray-500">Đang tải lịch sử thanh toán...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <CreditCard className="text-emerald-600" />
        Lịch sử thanh toán
      </h2>

      {history.length === 0 ? (
        <div className="text-gray-500 text-sm">
          Bạn chưa có giao dịch thanh toán nào.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-3">Mã đơn</th>
                <th>Số tiền</th>
                <th>Thời hạn</th>
                <th>Trạng thái</th>
                <th>Ngày duyệt</th>
                <th>Hết hạn</th>
              </tr>
            </thead>

            <tbody>
              {history.map((item, index) => (
                <tr
                  key={index}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="py-3 font-medium text-gray-800">
                    {item.orderId}
                  </td>

                  <td className="font-semibold text-emerald-600">
                    {item.amount?.toLocaleString()}₫
                  </td>

                  <td>
                    {item.durationDays} ngày
                  </td>

                  <td>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
                      {item.status}
                    </span>
                  </td>

                  <td className="text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(item.approvedAt).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(item.expiredAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
