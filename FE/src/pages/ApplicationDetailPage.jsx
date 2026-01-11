import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getApplicationDetail,
  updateApplicationStatus,
  inviteToInterview,
} from "../services/applicationService";

const statusMap = {
  pending: {
    label: "Chờ duyệt",
    className: "bg-yellow-100 text-yellow-700",
  },
  interview: {
    label: "Đang phỏng vấn",
    className: "bg-blue-100 text-blue-700",
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

  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [interviewNote, setInterviewNote] = useState("");

  const [submitting, setSubmitting] = useState(false);

  /* =====================
     QUAY LẠI
  ===================== */
  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/employer/jobs");
  };

  /* =====================
     FETCH DETAIL
  ===================== */
  useEffect(() => {
    if (!applicationId) return;

    const fetchDetail = async () => {
      try {
        const res = await getApplicationDetail(applicationId);
        setData(res);
      } catch (err) {
        console.error(err);
        alert("Không thể tải hồ sơ ứng viên");
        handleBack();
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  if (loading) return <p className="p-6">Đang tải...</p>;

  if (role !== "employer") {
    return (
      <div className="p-6 text-center text-red-600">
        Bạn không có quyền truy cập trang này
      </div>
    );
  }

  if (!data) return <p className="p-6">Không tìm thấy hồ sơ</p>;

  const {
    status,
    applied_at,
    snapshot,
    cover_letter,
    job_title,
    interview_time,
    interview_location,
    interview_note,
    interview_sent_at,
  } = data;

  const basic = snapshot?.basic || {};
  const skills = snapshot?.skills || [];
  const education = snapshot?.education || [];
  const experience = snapshot?.experience || [];

  /* =====================
     ACTIONS
  ===================== */
  const handleApprove = async () => {
    try {
      setSubmitting(true);
      await updateApplicationStatus(applicationId, "approved");
      alert("Ứng viên đã ĐẬU sau phỏng vấn");
      handleBack();
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim())
      return alert("Vui lòng nhập lý do từ chối");

    try {
      setSubmitting(true);
      await updateApplicationStatus(
        applicationId,
        "rejected",
        rejectReason
      );
      alert("Ứng viên KHÔNG đạt sau phỏng vấn");
      handleBack();
    } finally {
      setSubmitting(false);
    }
  };

  const handleInviteInterview = async () => {
    if (!interviewTime || !interviewLocation) {
      return alert("Vui lòng nhập thời gian và địa điểm phỏng vấn");
    }

    try {
      setSubmitting(true);
      await inviteToInterview(applicationId, {
        interview_time: interviewTime,
        interview_location: interviewLocation,
        interview_note: interviewNote,
      });
      alert("Đã gửi thư mời phỏng vấn");
      handleBack();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">
            {basic.full_name || "Ứng viên"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Ứng tuyển vị trí: {job_title}
          </p>
          <p className="text-sm text-gray-500">
            Nộp ngày{" "}
            {new Date(applied_at).toLocaleDateString("vi-VN")}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusMap[status]?.className}`}
          >
            {statusMap[status]?.label}
          </span>

          <button
            onClick={handleBack}
            className="text-sm text-gray-600 hover:underline"
          >
            ← Quay lại
          </button>
        </div>
      </div>

      {/* 🔵 INTERVIEW INFO */}
      {status === "interview" && (
        <Section title="Thông tin phỏng vấn">
          <ul className="text-sm space-y-2">
            <li>
              📅 <b>Thời gian:</b>{" "}
              {new Date(interview_time).toLocaleString("vi-VN")}
            </li>
            <li>
              📍 <b>Địa điểm:</b> {interview_location}
            </li>
            {interview_note && (
              <li>
                📝 <b>Ghi chú:</b> {interview_note}
              </li>
            )}
            <li>
              📨 <b>Gửi thư lúc:</b>{" "}
              {new Date(interview_sent_at).toLocaleString("vi-VN")}
            </li>
          </ul>
        </Section>
      )}

      {/* MAIN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <Section title="Thư xin việc">
            <p className="text-sm">
              {cover_letter || "Không có thư xin việc"}
            </p>
          </Section>

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

          <Section title="Kinh nghiệm làm việc">
            {experience.length === 0 ? (
              <Empty />
            ) : (
              experience.map((exp, i) => (
                <div key={i} className="border-l-2 pl-4 mb-4">
                  <p className="font-medium">{exp.position}</p>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-xs text-gray-500">
                    {exp.start_date} – {exp.end_date || "Hiện tại"}
                  </p>
                  {exp.description && (
                    <p className="text-sm mt-1">{exp.description}</p>
                  )}
                </div>
              ))
            )}
          </Section>

          <Section title="Học vấn">
            {education.length === 0 ? (
              <Empty />
            ) : (
              education.map((edu, i) => (
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
            <p className="text-sm">📧 {basic.email}</p>
            <p className="text-sm">📞 {basic.contact_number}</p>
          </Section>

          {/* ACTIONS */}
          {status === "pending" && (
            <ActionBox>
              <Primary onClick={() => setShowInterviewModal(true)}>
                Mời phỏng vấn
              </Primary>
              <Success onClick={handleApprove}>Duyệt hồ sơ</Success>
              <Danger onClick={() => setShowRejectModal(true)}>
                Từ chối
              </Danger>
            </ActionBox>
          )}

          {status === "interview" && (
            <ActionBox>
              <Success onClick={handleApprove}>
                Ứng viên ĐẬU
              </Success>
              <Danger onClick={() => setShowRejectModal(true)}>
                Ứng viên RỚT
              </Danger>
            </ActionBox>
          )}
        </div>
      </div>

      {/* MODALS */}
      {showInterviewModal && (
        <Modal title="Mời phỏng vấn" onClose={() => setShowInterviewModal(false)}>
          <input
            type="datetime-local"
            className="w-full border rounded p-2 text-sm"
            value={interviewTime}
            onChange={(e) => setInterviewTime(e.target.value)}
          />
          <input
            className="w-full border rounded p-2 text-sm mt-3"
            placeholder="Địa điểm phỏng vấn"
            value={interviewLocation}
            onChange={(e) => setInterviewLocation(e.target.value)}
          />
          <textarea
            className="w-full border rounded p-2 text-sm mt-3"
            rows={3}
            placeholder="Ghi chú"
            value={interviewNote}
            onChange={(e) => setInterviewNote(e.target.value)}
          />
          <ModalActions>
            <button onClick={() => setShowInterviewModal(false)}>Hủy</button>
            <Primary onClick={handleInviteInterview}>
              Gửi lời mời
            </Primary>
          </ModalActions>
        </Modal>
      )}

      {showRejectModal && (
        <Modal title="Lý do từ chối" onClose={() => setShowRejectModal(false)}>
          <textarea
            className="w-full border rounded p-2 text-sm"
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <ModalActions>
            <button onClick={() => setShowRejectModal(false)}>Hủy</button>
            <Danger onClick={handleConfirmReject}>Xác nhận</Danger>
          </ModalActions>
        </Modal>
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

const ActionBox = ({ children }) => (
  <div className="bg-white border rounded-lg p-4 space-y-3">
    {children}
  </div>
);

const Primary = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="w-full py-2 bg-blue-600 text-white rounded"
  >
    {children}
  </button>
);

const Success = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="w-full py-2 bg-green-600 text-white rounded"
  >
    {children}
  </button>
);

const Danger = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="w-full py-2 bg-red-600 text-white rounded"
  >
    {children}
  </button>
);

const Empty = () => (
  <p className="text-sm text-gray-500">Không có dữ liệu</p>
);

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
      <button
        onClick={onClose}
        className="absolute top-3 right-4 text-gray-400"
      >
        ✕
      </button>
    </div>
  </div>
);

const ModalActions = ({ children }) => (
  <div className="flex justify-end gap-3 mt-4">{children}</div>
);

export default ApplicationDetailPage;
