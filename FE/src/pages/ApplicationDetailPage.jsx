import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getApplicationDetail,
  updateApplicationStatus,
  inviteToInterview,
} from "../services/applicationService";
import {
  Calendar,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Users,
} from "lucide-react";

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

export default function ApplicationDetailPage() {
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

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/employer/jobs");
  };

  useEffect(() => {
    if (!applicationId) return;

    getApplicationDetail(applicationId)
      .then(setData)
      .catch(() => {
        alert("Không thể tải hồ sơ ứng viên");
        handleBack();
      })
      .finally(() => setLoading(false));
  }, [applicationId]);

  if (loading) {
    return (
      <div className="p-20 text-center text-gray-500">
        Đang tải hồ sơ ứng viên...
      </div>
    );
  }

  if (role !== "employer") {
    return (
      <div className="p-10 text-center text-red-600">
        Bạn không có quyền truy cập
      </div>
    );
  }

  if (!data) return null;

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

  const approve = async () => {
    await updateApplicationStatus(applicationId, "approved");
    alert("Ứng viên đã được duyệt");
    handleBack();
  };

  const reject = async () => {
    if (!rejectReason.trim()) return;
    await updateApplicationStatus(
      applicationId,
      "rejected",
      rejectReason
    );
    alert("Đã từ chối ứng viên");
    handleBack();
  };

  const invite = async () => {
    if (!interviewTime || !interviewLocation) return;
    await inviteToInterview(applicationId, {
      interview_time: interviewTime,
      interview_location: interviewLocation,
      interview_note: interviewNote,
    });
    alert("Đã gửi lời mời phỏng vấn");
    handleBack();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">
            {basic.full_name || "Ứng viên"}
          </h1>
          <p className="text-sm text-gray-500">
            Ứng tuyển vị trí: {job_title}
          </p>
          <p className="text-sm text-gray-500">
            Nộp ngày{" "}
            {new Date(applied_at).toLocaleDateString("vi-VN")}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusMap[status].className}`}
          >
            {statusMap[status].label}
          </span>

          <button
            onClick={handleBack}
            className="text-sm text-gray-600 hover:underline"
          >
            ← Quay lại
          </button>
        </div>
      </div>

      {/* INTERVIEW INFO */}
      {status === "interview" && (
        <Section title="Thông tin phỏng vấn">
          <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2">
              <Calendar size={14} />
              {new Date(interview_time).toLocaleString("vi-VN")}
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} />
              {interview_location}
            </li>
            {interview_note && <li>{interview_note}</li>}
            <li className="text-xs text-gray-500">
              Gửi lúc{" "}
              {new Date(interview_sent_at).toLocaleString("vi-VN")}
            </li>
          </ul>
        </Section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <Section title="Thư xin việc">
            {cover_letter || <Empty />}
          </Section>

          <Section title="Kỹ năng">
            {skills.length ? (
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
            ) : (
              <Empty />
            )}
          </Section>

          <Section title="Kinh nghiệm">
            {experience.length ? (
              experience.map((e, i) => (
                <Timeline
                  key={i}
                  title={e.position}
                  subtitle={e.company}
                  time={`${e.start_date} – ${
                    e.end_date || "Hiện tại"
                  }`}
                  desc={e.description}
                />
              ))
            ) : (
              <Empty />
            )}
          </Section>

          <Section title="Học vấn">
            {education.length ? (
              education.map((e, i) => (
                <Timeline
                  key={i}
                  title={e.school}
                  subtitle={`${e.degree} – ${e.major}`}
                  time={`${e.start_date} – ${
                    e.end_date || "Hiện tại"
                  }`}
                />
              ))
            ) : (
              <Empty />
            )}
          </Section>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <Section title="Liên hệ">
            <p className="text-sm flex items-center gap-2">
              <Mail size={14} /> {basic.email}
            </p>
            <p className="text-sm flex items-center gap-2">
              <Phone size={14} /> {basic.contact_number}
            </p>
          </Section>

          {status === "pending" && (
            <ActionBox>
              <Primary onClick={() => setShowInterviewModal(true)}>
                Mời phỏng vấn
              </Primary>
              <Danger onClick={() => setShowRejectModal(true)}>
                Từ chối
              </Danger>
            </ActionBox>
          )}

          {status === "interview" && (
            <ActionBox>
              <Success onClick={approve}>
                <CheckCircle2 size={14} />
                Duyệt hồ sơ
              </Success>
              <Danger onClick={() => setShowRejectModal(true)}>
                <XCircle size={14} />
                Từ chối
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
            className="input"
            value={interviewTime}
            onChange={(e) => setInterviewTime(e.target.value)}
          />
          <input
            className="input mt-3"
            placeholder="Địa điểm"
            value={interviewLocation}
            onChange={(e) => setInterviewLocation(e.target.value)}
          />
          <textarea
            rows={3}
            className="input mt-3"
            placeholder="Ghi chú"
            value={interviewNote}
            onChange={(e) => setInterviewNote(e.target.value)}
          />
          <ModalActions>
            <button onClick={() => setShowInterviewModal(false)}>Hủy</button>
            <Primary onClick={invite}>Gửi</Primary>
          </ModalActions>
        </Modal>
      )}

      {showRejectModal && (
        <Modal title="Lý do từ chối" onClose={() => setShowRejectModal(false)}>
          <textarea
            rows={4}
            className="input"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <ModalActions>
            <button onClick={() => setShowRejectModal(false)}>Hủy</button>
            <Danger onClick={reject}>Xác nhận</Danger>
          </ModalActions>
        </Modal>
      )}
    </div>
  );
}

/* UI */
const Section = ({ title, children }) => (
  <div className="bg-white border rounded-2xl p-6">
    <h3 className="font-semibold mb-4 flex items-center gap-2">
      <Users size={16} /> {title}
    </h3>
    {children}
  </div>
);

const Timeline = ({ title, subtitle, time, desc }) => (
  <div className="border-l-2 pl-4 mb-4">
    <p className="font-medium">{title}</p>
    <p className="text-sm text-gray-600">{subtitle}</p>
    <p className="text-xs text-gray-500">{time}</p>
    {desc && <p className="text-sm mt-1">{desc}</p>}
  </div>
);

const ActionBox = ({ children }) => (
  <div className="bg-white border rounded-2xl p-4 space-y-3">
    {children}
  </div>
);

const Primary = ({ children, onClick }) => (
  <button onClick={onClick} className="btn-primary">
    {children}
  </button>
);

const Success = ({ children, onClick }) => (
  <button onClick={onClick} className="btn-success">
    {children}
  </button>
);

const Danger = ({ children, onClick }) => (
  <button onClick={onClick} className="btn-danger">
    {children}
  </button>
);

const Empty = () => (
  <p className="text-sm text-gray-500 italic">Không có dữ liệu</p>
);

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
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
