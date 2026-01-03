import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApplicantsByJob } from "../services/applicationService";

const FILTERS = {
  ALL: "all",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

const statusConfig = {
  pending: {
    label: "Chờ duyệt",
    className: "bg-yellow-100 text-yellow-700",
  },
  approved: {
    label: "Đã duyệt",
    className: "bg-green-100 text-green-700",
  },
  rejected: {
    label: "Từ chối",
    className: "bg-red-100 text-red-700",
  },
};

function EmployerApplicantsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(FILTERS.ALL);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await getApplicantsByJob(jobId);
        setApplicants(Array.isArray(res) ? res : []);
      } catch (e) {
        console.error(e);
        alert("Không thể tải danh sách ứng viên");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  /* =====================
     DERIVED DATA
  ===================== */
  const summary = useMemo(() => {
    return {
      total: applicants.length,
      pending: applicants.filter((a) => a.status === "pending").length,
      approved: applicants.filter((a) => a.status === "approved").length,
      rejected: applicants.filter((a) => a.status === "rejected").length,
    };
  }, [applicants]);

  const filteredApplicants = useMemo(() => {
    if (filter === FILTERS.ALL) return applicants;
    return applicants.filter((a) => a.status === filter);
  }, [filter, applicants]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* =====================
          HEADER
      ===================== */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">
            Danh sách ứng viên
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý và đánh giá hồ sơ ứng tuyển
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Quay lại
        </button>
      </div>

      {/* =====================
          SUMMARY
      ===================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Tổng ứng viên" value={summary.total} />
        <SummaryCard label="Chờ duyệt" value={summary.pending} />
        <SummaryCard label="Đã duyệt" value={summary.approved} />
        <SummaryCard label="Từ chối" value={summary.rejected} />
      </div>

      {/* =====================
          FILTER TABS
      ===================== */}
      <div className="flex gap-2 border-b">
        {[
          ["Tất cả", FILTERS.ALL, summary.total],
          ["Chờ duyệt", FILTERS.PENDING, summary.pending],
          ["Đã duyệt", FILTERS.APPROVED, summary.approved],
          ["Từ chối", FILTERS.REJECTED, summary.rejected],
        ].map(([label, key, count]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 text-sm border-b-2 ${
              filter === key
                ? "border-green-600 text-green-600 font-medium"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* =====================
          LIST
      ===================== */}
      <div className="bg-white border rounded-lg divide-y">
        {loading && (
          <p className="p-6 text-sm text-gray-500">Đang tải...</p>
        )}

        {!loading && filteredApplicants.length === 0 && (
          <p className="p-6 text-sm text-gray-500">
            Không có ứng viên phù hợp
          </p>
        )}

        {!loading &&
          filteredApplicants.map((app) => (
            <div
              key={app.application_id}
              className="flex justify-between items-center p-4 hover:bg-gray-50"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {app.full_name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Nộp ngày{" "}
                  {new Date(app.applied_at).toLocaleDateString(
                    "vi-VN"
                  )}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusConfig[app.status]?.className
                  }`}
                >
                  {statusConfig[app.status]?.label}
                </span>

                <button
                  onClick={() =>
                    navigate(
                      `/employer/applications/${app.application_id}`
                    )
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Xem hồ sơ
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

/* =====================
   COMPONENTS
===================== */
const SummaryCard = ({ label, value }) => (
  <div className="bg-white border rounded-lg p-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-semibold mt-1">{value}</p>
  </div>
);

export default EmployerApplicantsPage;
