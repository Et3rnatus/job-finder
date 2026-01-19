import { useEffect, useState } from "react";
import employerService from "../../services/employerService";

export default function EmployerPackageSummary() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    employerService
      .getPackageStatus()
      .then((res) => {
        console.log("PACKAGE STATUS:", res); // 🔍 DEBUG QUAN TRỌNG
        setData(res);
      })
      .catch((err) => {
        console.error("GET PACKAGE STATUS ERROR:", err);
        setError("Không thể tải thông tin gói dịch vụ");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /* =====================
     LOADING
  ===================== */
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 text-sm text-gray-500">
        Đang tải thông tin gói dịch vụ...
      </div>
    );
  }

  /* =====================
     ERROR
  ===================== */
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-700">
        {error}
      </div>
    );
  }

  /* =====================
     NO PACKAGE
  ===================== */
  if (!data || !data.currentPackage) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-sm text-gray-600">
        Bạn chưa đăng ký gói dịch vụ nào.
      </div>
    );
  }

  const {
    currentPackage,
    job_post_limit,
    job_post_used,
    remaining_posts,
  } = data;

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">
          Gói đang sử dụng
        </h3>

        {!currentPackage.isActive && (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700">
            Đã hết hạn
          </span>
        )}
      </div>

      {/* PACKAGE NAME */}
      <p className="mt-2 text-emerald-700 font-semibold">
        {currentPackage.packageName}
      </p>

      {/* REMAINING DAYS */}
      <p className="text-sm text-gray-500 mt-1">
        Còn <b>{currentPackage.remainingDays}</b> ngày sử dụng
      </p>

      {/* QUOTA */}
      <div className="mt-4 text-sm text-gray-700">
        {job_post_limit === -1 ? (
          <div className="font-semibold text-emerald-600">
            Không giới hạn số tin đăng
          </div>
        ) : (
          <div className="space-y-1">
            <div>
              Đã sử dụng:{" "}
              <b>
                {job_post_used} / {job_post_limit}
              </b>{" "}
              tin
            </div>
            <div>
              Còn lại:{" "}
              <b className="text-emerald-600">
                {remaining_posts}
              </b>{" "}
              tin
            </div>
          </div>
        )}
      </div>

      {/* FOOTER NOTE */}
      <div className="mt-4 text-xs text-gray-400 italic">
        Gói dịch vụ được kích hoạt sau khi admin xác nhận thanh toán
      </div>
    </div>
  );
}
