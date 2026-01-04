import { useEffect, useState } from "react";
import { getJobs } from "../../services/adminService";

import JobTable from "../../components/admin/JobTable";
import JobReviewModal from "../../components/admin/JobReviewModal";
import JobAuditModal from "../../components/admin/JobAuditModal";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // review job (xem chi tiết + duyệt / từ chối)
  const [reviewJobId, setReviewJobId] = useState(null);

  // audit log
  const [auditJobId, setAuditJobId] = useState(null);

  /* =====================
     LOAD JOBS (PENDING)
  ===================== */
  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await getJobs("pending");
      setJobs(res);
    } catch (error) {
      console.error("GET ADMIN JOBS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  if (loading) {
    return (
      <p className="text-gray-500">
        Loading jobs...
      </p>
    );
  }

  return (
    <div>
      {/* ===== TITLE ===== */}
      <h1 className="text-2xl font-bold mb-6">
        Job Moderation
      </h1>

      {/* ===== JOB TABLE ===== */}
      <JobTable
        jobs={jobs}
        onReview={(id) => setReviewJobId(id)}
        onViewLogs={(id) => setAuditJobId(id)}
      />

      {/* ===== REVIEW MODAL ===== */}
      {reviewJobId && (
        <JobReviewModal
          jobId={reviewJobId}
          onClose={() => setReviewJobId(null)}
          onSuccess={loadJobs}
        />
      )}

      {/* ===== AUDIT LOG MODAL ===== */}
      {auditJobId && (
        <JobAuditModal
          jobId={auditJobId}
          onClose={() => setAuditJobId(null)}
        />
      )}
    </div>
  );
}
