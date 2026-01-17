import { useEffect, useState } from "react";
import { getJobs } from "../../services/adminService";
import {
  ShieldCheck,
  Loader2,
  ClipboardList,
  RefreshCcw,
  AlertTriangle,
} from "lucide-react";

import JobTable from "../../components/admin/JobTable";
import JobReviewModal from "../../components/admin/JobReviewModal";
import JobAuditModal from "../../components/admin/JobAuditModal";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [reviewJobId, setReviewJobId] = useState(null);
  const [auditJobId, setAuditJobId] = useState(null);

  /* =====================
     LOAD JOBS
  ===================== */
  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await getJobs("pending");
      setJobs(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("GET ADMIN JOBS ERROR:", err);
      setError(true);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  /* =====================
     LOADING STATE
  ===================== */
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-3xl p-20 flex flex-col items-center gap-4 text-gray-500 shadow-sm">
        <Loader2
          className="animate-spin text-emerald-600"
          size={32}
        />
        <p className="text-sm">
          Đang tải danh sách tin tuyển dụng...
        </p>
      </div>
    );
  }

  /* =====================
     ERROR STATE
  ===================== */
  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-3xl p-16 flex flex-col items-center gap-4 text-red-600 shadow-sm">
        <AlertTriangle size={32} />
        <p className="font-semibold">
          Không thể tải danh sách tin tuyển dụng
        </p>
        <button
          onClick={loadJobs}
          className="
            mt-3 inline-flex items-center gap-2
            px-5 py-2 rounded-full
            text-sm font-semibold
            bg-red-50 text-red-600
            hover:bg-red-100
            transition
          "
        >
          <RefreshCcw size={14} />
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* =====================
          HEADER
      ===================== */}
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <ShieldCheck size={26} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Job Moderation
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Duyệt & kiểm soát tin tuyển dụng chờ phê duyệt
          </p>
        </div>
      </div>

      {/* =====================
          STATS BAR
      ===================== */}
      <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ClipboardList size={16} />
          Tổng tin chờ duyệt:{" "}
          <span className="font-semibold text-gray-900">
            {jobs.length}
          </span>
        </div>

        <button
          onClick={loadJobs}
          className="
            inline-flex items-center gap-2
            text-sm font-semibold
            text-emerald-600
            hover:text-emerald-700
            transition
          "
        >
          <RefreshCcw size={14} />
          Làm mới
        </button>
      </div>

      {/* =====================
          TABLE
      ===================== */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        {jobs.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            Không có tin tuyển dụng nào đang chờ duyệt
          </div>
        ) : (
          <JobTable
            jobs={jobs}
            onReview={(id) => setReviewJobId(id)}
            onViewLogs={(id) => setAuditJobId(id)}
          />
        )}
      </div>

      {/* =====================
          REVIEW MODAL
      ===================== */}
      {reviewJobId && (
        <JobReviewModal
          jobId={reviewJobId}
          onClose={() => setReviewJobId(null)}
          onSuccess={loadJobs}
        />
      )}

      {/* =====================
          AUDIT MODAL
      ===================== */}
      {auditJobId && (
        <JobAuditModal
          jobId={auditJobId}
          onClose={() => setAuditJobId(null)}
        />
      )}
    </div>
  );
}
