import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getApplicationDetail,
  updateApplicationStatus,
} from "../services/applicationService";

const statusMap = {
  pending: {
    label: "Đang chờ duyệt",
    className: "bg-yellow-100 text-yellow-700",
  },
  approved: {
    label: "Đã duyệt",
    className: "bg-green-100 text-green-700",
  },
  rejected: {
    label: "Đã từ chối",
    className: "bg-red-100 text-red-700",
  },
};

function ApplicationDetailPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!applicationId) return;

    const fetchDetail = async () => {
      try {
        const res = await getApplicationDetail(applicationId);
        setData(res);
      } catch {
        alert("Không thể tải hồ sơ ứng viên");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [applicationId, navigate]);

  if (loading) return <p className="p-6">Đang tải...</p>;

  if (role !== "employer") {
    return (
      <div className="p-6 text-center text-red-600">
        Bạn không có quyền truy cập trang này
      </div>
    );
  }

  if (!data || !data.candidate) {
    return <p className="p-6">Không tìm thấy hồ sơ</p>;
  }

  const { status, applied_at, candidate } = data;
  const {
    full_name,
    email,
    contact_number,
    skills = [],
    experiences = [],
    educations = [],
  } = candidate;

  const handleApprove = async () => {
    try {
      setSubmitting(true);
      await updateApplicationStatus(applicationId, "approved");
      alert("Đã duyệt hồ sơ");
      navigate(-1);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) return alert("Vui lòng nhập lý do từ chối");

    try {
      setSubmitting(true);
      await updateApplicationStatus(applicationId, "rejected", rejectReason);
      alert("Đã từ chối hồ sơ");
      navigate(-1);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">{full_name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Nộp ngày{" "}
            {new Date(applied_at).toLocaleDateString("vi-VN")}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              statusMap[status]?.className
            }`}
          >
            {statusMap[status]?.label}
          </span>

          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600 hover:underline"
          >
            ← Quay lại
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* SKILLS */}
          <Section title="Kỹ năng">
            {skills.length === 0 ? (
              <Empty />
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </Section>

          {/* EXPERIENCE */}
          <Section title="Kinh nghiệm làm việc">
            {experiences.length === 0 ? (
              <Empty />
            ) : (
              experiences.map((exp, i) => (
                <div key={i} className="border-l-2 pl-4 mb-4">
                  <p className="font-medium">{exp.position}</p>
                  <p className="text-sm text-gray-600">
                    {exp.company}
                  </p>
                  <p className="text-xs text-gray-500">
                    {exp.start_date} – {exp.end_date || "Hiện tại"}
                  </p>
                  {exp.description && (
                    <p className="text-sm mt-1">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))
            )}
          </Section>

          {/* EDUCATION */}
          <Section title="Học vấn">
            {educations.length === 0 ? (
              <Empty />
            ) : (
              educations.map((edu, i) => (
                <div key={i} className="border-l-2 pl-4 mb-4">
                  <p className="font-medium">{edu.school}</p>
                  <p className="text-sm text-gray-600">
                    {edu.degree} – {edu.major}
                  </p>
                  <p className="text-xs text-gray-500">
                    {edu.start_date} – {edu.end_date || "Hiện tại"}
                  </p>
                </div>
              ))
            )}
          </Section>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <Section title="Thông tin liên hệ">
            <p className="text-sm">📧 {email}</p>
            <p className="text-sm mt-1">
              📞 {contact_number || "Chưa cập nhật"}
            </p>
          </Section>

          {status === "pending" && (
            <div className="bg-white border rounded-lg p-4 space-y-3">
              <button
                onClick={handleApprove}
                disabled={submitting}
                className="w-full py-2 bg-green-600 text-white rounded"
              >
                Duyệt hồ sơ
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={submitting}
                className="w-full py-2 bg-red-600 text-white rounded"
              >
                Từ chối
              </button>
            </div>
          )}
        </div>
      </div>

      {/* REJECT MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Lý do từ chối hồ sơ
            </h3>

            <textarea
              className="w-full border rounded p-3 text-sm"
              rows={4}
              placeholder="Nhập lý do từ chối..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================
   UI HELPERS
===================== */
const Section = ({ title, children }) => (
  <div className="bg-white border rounded-lg p-6">
    <h3 className="font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const Empty = () => (
  <p className="text-sm text-gray-500">Không có dữ liệu</p>
);

export default ApplicationDetailPage;
