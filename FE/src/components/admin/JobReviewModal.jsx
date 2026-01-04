import { useEffect, useState } from "react";
import {
  getJobDetailForAdmin,
  approveJob,
  rejectJob,
} from "../../services/adminService";

export default function JobReviewModal({
  jobId,
  onClose,
  onSuccess,
}) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectNote, setRejectNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* =====================
     LOAD JOB DETAIL
  ===================== */
  useEffect(() => {
    const loadJob = async () => {
      try {
        const res = await getJobDetailForAdmin(jobId);
        setJob(res);
      } catch (err) {
        console.error("GET JOB DETAIL ADMIN ERROR:", err);
        alert("Không thể tải chi tiết công việc");
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

  /* =====================
     ACTIONS
  ===================== */
  const handleApprove = async () => {
    if (!window.confirm("Duyệt tin tuyển dụng này?")) return;

    try {
      setSubmitting(true);
      await approveJob(jobId);
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      alert("Không thể duyệt công việc");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectNote.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }

    try {
      setSubmitting(true);
      await rejectJob(jobId, { admin_note: rejectNote });
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      alert("Không thể từ chối công việc");
    } finally {
      setSubmitting(false);
    }
  };

  /* =====================
     RENDER
  ===================== */
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            Duyệt tin tuyển dụng
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {loading && (
          <p className="text-gray-500">
            Đang tải dữ liệu...
          </p>
        )}

        {!loading && job && (
          <>
            {/* =====================
                JOB BASIC
            ===================== */}
            <section className="mb-6">
              <h3 className="text-lg font-semibold">
                {job.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {job.company_name}
              </p>
            </section>

            {/* =====================
                JOB CONTENT
            ===================== */}
            <Section title="Mô tả công việc">
              {job.description}
            </Section>

            <Section title="Yêu cầu ứng viên">
              {job.job_requirements}
            </Section>

            <Section title="Quyền lợi">
              {job.benefits}
            </Section>

            {/* =====================
                JOB INFO GRID
            ===================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Info label="Hình thức làm việc" value={job.employment_type} />
              <Info label="Kinh nghiệm" value={job.experience} />
              <Info label="Cấp bậc" value={job.level} />
              <Info label="Học vấn" value={job.education_level} />
              <Info
                label="Số lượng tuyển"
                value={job.hiring_quantity}
              />
              <Info
                label="Hạn nộp hồ sơ"
                value={
                  job.expired_at
                    ? new Date(job.expired_at).toLocaleDateString(
                        "vi-VN"
                      )
                    : "—"
                }
              />
            </div>

            {/* =====================
                SKILLS
            ===================== */}
            {job.skills?.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2">
                  Kỹ năng yêu cầu
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <span
                      key={s.id}
                      className="px-3 py-1 text-sm border rounded-full bg-gray-50"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* =====================
                COMPANY INFO
            ===================== */}
            <div className="border-t pt-4 mb-6">
              <h4 className="font-semibold mb-2">
                Thông tin công ty
              </h4>
              <p className="text-sm">
                <strong>Tên:</strong>{" "}
                {job.company_name}
              </p>
              {job.company_website && (
                <p className="text-sm">
                  <strong>Website:</strong>{" "}
                  {job.company_website}
                </p>
              )}
              {job.company_address && (
                <p className="text-sm">
                  <strong>Địa chỉ:</strong>{" "}
                  {job.company_address}
                </p>
              )}
              {job.company_description && (
                <p className="text-sm mt-2">
                  {job.company_description}
                </p>
              )}
            </div>

            {/* =====================
                ACTIONS
            ===================== */}
            <div className="border-t pt-4">
              <textarea
                value={rejectNote}
                onChange={(e) =>
                  setRejectNote(e.target.value)
                }
                rows={3}
                placeholder="Lý do từ chối (chỉ nhập khi từ chối)"
                className="w-full border rounded-lg p-3 mb-4"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleReject}
                  disabled={submitting}
                  className="px-4 py-2 border rounded-lg text-red-600 hover:bg-red-50"
                >
                  Từ chối
                </button>
                <button
                  onClick={handleApprove}
                  disabled={submitting}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Duyệt
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* =====================
   SMALL COMPONENTS
===================== */

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h4 className="font-semibold mb-2">{title}</h4>
    <p className="text-sm text-gray-700 whitespace-pre-line">
      {children || "—"}
    </p>
  </div>
);

const Info = ({ label, value }) => (
  <div className="text-sm">
    <span className="text-gray-500">
      {label}:
    </span>{" "}
    <span className="font-medium">
      {value || "—"}
    </span>
  </div>
);
