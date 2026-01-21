import { useEffect, useState } from "react";
import {
  getJobDetailForAdmin,
  approveJob,
  rejectJob,
} from "../../services/adminService";
import {
  X,
  CheckCircle2,
  XCircle,
  Building2,
  Briefcase,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import { toast } from "react-hot-toast";

/* =====================
   ENUM MAPS
===================== */
const employmentMap = {
  fulltime: "Toàn thời gian",
  parttime: "Bán thời gian",
  intern: "Thực tập",
};

const experienceMap = {
  no_experience: "Không yêu cầu",
  under_1_year: "Dưới 1 năm",
  "1_year": "1 năm",
  "2_3_years": "2–3 năm",
  over_3_years: "Trên 3 năm",
};

export default function JobReviewModal({
  jobId,
  onClose,
  onSuccess,
}) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectNote, setRejectNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirm, setConfirm] = useState(null); // approve | reject

  /* =====================
     LOAD JOB
  ===================== */
  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        const res = await getJobDetailForAdmin(jobId);
        setJob(res);
      } catch {
        alert("Không thể tải chi tiết công việc");
      } finally {
        setLoading(false);
      }
    };
    if (jobId) loadJob();
  }, [jobId]);

  /* =====================
     ACTIONS
  ===================== */
  const approve = async () => {
  try {
    setSubmitting(true);
    const res = await approveJob(jobId);

    toast.success(res.message || "Duyệt tin thành công");

    onSuccess?.();
    onClose();
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Duyệt tin thất bại"
    );
  } finally {
    setSubmitting(false);
  }
};


  const reject = async () => {
  if (!rejectNote.trim()) {
    toast.error("Vui lòng nhập lý do từ chối");
    return;
  }

  try {
    setSubmitting(true);
    await rejectJob(jobId, rejectNote.trim());
    toast.success("Đã từ chối tin tuyển dụng");
    onSuccess?.();
    onClose();
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Từ chối tin thất bại"
    );
  } finally {
    setSubmitting(false);
  }
};



  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 shadow-[0_26px_80px_rgba(0,0,0,0.28)]">

        {/* ===== HEADER ===== */}
        <div className="sticky top-0 z-10 bg-white border-b p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            <div>
              <h2 className="text-xl font-semibold">
                Duyệt tin tuyển dụng
              </h2>
              <p className="text-sm text-gray-500">
                Kiểm tra nội dung trước khi công khai
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={submitting}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          >
            <X />
          </button>
        </div>

        {/* ===== LOADING ===== */}
        {loading && (
          <div className="p-12 flex items-center justify-center gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            Đang tải dữ liệu công việc...
          </div>
        )}

        {/* ===== CONTENT ===== */}
        {!loading && job && (
          <div className="p-8 space-y-10">

            {/* BASIC */}
            <section>
              <h3 className="text-2xl font-semibold">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Building2 className="w-4 h-4" />
                {job.company_name}
              </div>
            </section>

            <ContentSection title="Mô tả công việc">
              {job.description}
            </ContentSection>

            <ContentSection title="Yêu cầu ứng viên">
              {job.job_requirements}
            </ContentSection>

            <ContentSection title="Quyền lợi">
              {job.benefits}
            </ContentSection>

            {/* META */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Info label="Hình thức" value={employmentMap[job.employment_type]} />
              <Info label="Kinh nghiệm" value={experienceMap[job.experience]} />
              <Info label="Cấp bậc" value={job.level} />
              <Info label="Học vấn" value={job.education_level} />
              <Info label="Số lượng tuyển" value={job.hiring_quantity} />
              <Info
                label="Hạn nộp"
                value={
                  job.expired_at
                    ? new Date(job.expired_at).toLocaleDateString("vi-VN")
                    : "—"
                }
              />
            </div>

            {/* SKILLS */}
            {job.skills?.length > 0 && (
              <section>
                <h4 className="font-semibold mb-3">
                  Kỹ năng yêu cầu
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <span
                      key={s.id}
                      className="px-3 py-1 rounded-full text-sm bg-indigo-50 text-indigo-700 border border-indigo-200"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* COMPANY */}
            <section className="rounded-xl border bg-gray-50 p-4">
              <h4 className="font-semibold mb-2">
                Thông tin doanh nghiệp
              </h4>
              <p className="text-sm">
                <strong>Tên:</strong> {job.company_name}
              </p>
              {job.company_website && (
                <p className="text-sm">
                  <strong>Website:</strong> {job.company_website}
                </p>
              )}
              {job.company_address && (
                <p className="text-sm">
                  <strong>Địa chỉ:</strong> {job.company_address}
                </p>
              )}
              {job.company_description && (
                <p className="text-sm mt-2 text-gray-700">
                  {job.company_description}
                </p>
              )}
            </section>

            {/* DECISION */}
            <section className="border-t pt-6 space-y-4">
              <div className="flex items-start gap-2 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <AlertTriangle className="w-4 h-4 mt-0.5" />
                Quyết định duyệt hoặc từ chối sẽ ảnh hưởng trực tiếp đến việc hiển thị tin tuyển dụng.
              </div>

              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                rows={3}
                placeholder="Lý do từ chối (bắt buộc nếu từ chối)"
                className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-red-200"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirm("reject")}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  Từ chối
                </button>

                <button
                  onClick={() => setConfirm("approve")}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Duyệt tin
                </button>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* ===== CONFIRM MODAL ===== */}
      {confirm && (
        <ConfirmModal
          type={confirm}
          onCancel={() => setConfirm(null)}
          onConfirm={confirm === "approve" ? approve : reject}
          disabled={submitting}
        />
      )}
    </div>
  );
}

/* =====================
   SMALL COMPONENTS
===================== */

const ContentSection = ({ title, children }) => (
  <section>
    <h4 className="font-semibold mb-2">{title}</h4>
    <p className="text-sm text-gray-700 whitespace-pre-line">
      {children || "—"}
    </p>
  </section>
);

const Info = ({ label, value }) => (
  <div className="rounded-xl border p-3 bg-white text-sm">
    <p className="text-gray-500">{label}</p>
    <p className="font-medium">{value || "—"}</p>
  </div>
);

const ConfirmModal = ({
  type,
  onCancel,
  onConfirm,
  disabled,
}) => (
  <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center">
    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
      <AlertTriangle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
      <h3 className="text-lg font-semibold mb-1">
        {type === "approve"
          ? "Xác nhận duyệt tin?"
          : "Xác nhận từ chối?"}
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Hành động này không thể hoàn tác.
      </p>

      <div className="flex justify-center gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
        >
          Hủy
        </button>
        <button
          onClick={onConfirm}
          disabled={disabled}
          className={`px-4 py-2 rounded-lg font-medium text-white
            ${
              type === "approve"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            } disabled:opacity-50`}
        >
          Xác nhận
        </button>
      </div>
    </div>
  </div>
);
