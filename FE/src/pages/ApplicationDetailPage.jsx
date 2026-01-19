import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
  Loader2,
  AlertTriangle,
} from "lucide-react";

/* =====================
   STATUS MAP
===================== */
const statusMap = {
  pending: {
    label: "Chờ duyệt",
    className: "bg-amber-100 text-amber-700",
  },
  interview: {
    label: "Đang phỏng vấn",
    className: "bg-blue-100 text-blue-700",
  },
  approved: {
    label: "Đã duyệt",
    className: "bg-emerald-100 text-emerald-700",
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
  const [processing, setProcessing] = useState(false);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [interviewNote, setInterviewNote] = useState("");
  const [timeError, setTimeError] = useState("");

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/employer/jobs");
  };

  /* =====================
     LOAD DATA
  ===================== */
  useEffect(() => {
    if (!applicationId) return;

    setLoading(true);
    getApplicationDetail(applicationId)
      .then(setData)
      .catch(() => {
        toast.error("Không thể tải hồ sơ ứng viên");
        handleBack();
      })
      .finally(() => setLoading(false));
  }, [applicationId]);

  if (role !== "employer") {
    return (
      <div className="bg-white border border-red-200 rounded-3xl p-12 text-center text-red-600">
        Bạn không có quyền truy cập
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white border rounded-3xl p-20 flex flex-col items-center gap-4 text-gray-500">
        <Loader2 className="animate-spin" size={28} />
        Đang tải hồ sơ ứng viên...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white border border-red-200 rounded-3xl p-12 flex flex-col items-center gap-3 text-red-600">
        <AlertTriangle size={28} />
        Không tìm thấy hồ sơ ứng viên
      </div>
    );
  }

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
  const approve = async () => {
    if (processing) return;
    try {
      setProcessing(true);
      await updateApplicationStatus(applicationId, "approved");
      toast.success("Ứng viên đã được duyệt");
      handleBack();
    } finally {
      setProcessing(false);
    }
  };

  const reject = async () => {
    if (!rejectReason.trim() || processing) return;
    try {
      setProcessing(true);
      await updateApplicationStatus(applicationId, "rejected", rejectReason);
      toast.success("Đã từ chối ứng viên");
      handleBack();
    } finally {
      setProcessing(false);
    }
  };

  const invite = async () => {
    const selected = new Date(interviewTime);
    if (selected <= new Date()) {
      setTimeError("Thời gian phỏng vấn phải lớn hơn thời điểm hiện tại");
      return;
    }

    if (!interviewLocation || processing) return;

    try {
      setProcessing(true);
      await inviteToInterview(applicationId, {
        interview_time: interviewTime,
        interview_location: interviewLocation,
        interview_note: interviewNote,
      });
      toast.success("Đã gửi lời mời phỏng vấn");
      handleBack();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-start gap-6">
        <div>
          <h1 className="text-2xl font-semibold">
            {basic.full_name || "Ứng viên"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Ứng tuyển vị trí:{" "}
            <span className="font-medium">{job_title}</span>
          </p>
          <p className="text-sm text-gray-500">
            Nộp ngày {new Date(applied_at).toLocaleDateString("vi-VN")}
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
            {interview_note && (
              <li className="text-sm text-gray-600">{interview_note}</li>
            )}
            <li className="text-xs text-gray-400">
              Gửi lúc {new Date(interview_sent_at).toLocaleString("vi-VN")}
            </li>
          </ul>
        </Section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <Section title="Thư xin việc">{cover_letter || <Empty />}</Section>

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
                  time={`${e.start_date} – ${e.end_date || "Hiện tại"}`}
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
                  title={e.institution}
                  subtitle={`${e.level} – ${e.major}`}
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
              <Mail size={14} /> {basic.email || "—"}
            </p>
            <p className="text-sm flex items-center gap-2">
              <Phone size={14} /> {basic.contact_number || "—"}
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

      {/* MODAL – MỜI PHỎNG VẤN */}
      {showInterviewModal && (
        <Modal title="Mời phỏng vấn" onClose={() => setShowInterviewModal(false)}>
          <div className="space-y-4">
            <FormField label="Thời gian phỏng vấn *">
              <Input
                type="datetime-local"
                value={interviewTime}
                onChange={(e) => {
                  const value = e.target.value;
                  setInterviewTime(value);

                  if (!value) {
                    setTimeError("Vui lòng chọn thời gian phỏng vấn");
                    return;
                  }

                  const selected = new Date(value);
                  if (selected <= new Date()) {
                    setTimeError(
                      "Thời gian phỏng vấn phải lớn hơn thời điểm hiện tại"
                    );
                  } else {
                    setTimeError("");
                  }
                }}
              />
              {timeError && (
                <p className="text-xs text-red-600 mt-1">{timeError}</p>
              )}
            </FormField>

            <FormField label="Địa điểm *">
              <Input
                placeholder="VD: Văn phòng công ty / Google Meet"
                value={interviewLocation}
                onChange={(e) => setInterviewLocation(e.target.value)}
              />
            </FormField>

            <FormField label="Ghi chú (tuỳ chọn)">
              <Textarea
                rows={3}
                value={interviewNote}
                onChange={(e) => setInterviewNote(e.target.value)}
              />
            </FormField>
          </div>

          <ModalActions>
            <TextButton onClick={() => setShowInterviewModal(false)}>
              Hủy
            </TextButton>
            <Primary
              disabled={
                !interviewTime ||
                !interviewLocation ||
                !!timeError ||
                processing
              }
              onClick={invite}
            >
              Gửi lời mời
            </Primary>
          </ModalActions>
        </Modal>
      )}

      {/* MODAL – TỪ CHỐI */}
      {showRejectModal && (
        <Modal
          title="Xác nhận từ chối ứng viên"
          onClose={() => setShowRejectModal(false)}
        >
          <FormField label="Lý do từ chối *">
            <Textarea
              rows={4}
              placeholder="Ví dụ: Chưa phù hợp với yêu cầu vị trí..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </FormField>

          <ModalActions>
            <TextButton onClick={() => setShowRejectModal(false)}>
              Hủy
            </TextButton>
            <Danger disabled={!rejectReason.trim()} onClick={reject}>
              Xác nhận từ chối
            </Danger>
          </ModalActions>
        </Modal>
      )}
    </div>
  );
}

/* =====================
   UI COMPONENTS
===================== */

const Section = ({ title, children }) => (
  <div className="bg-white border rounded-2xl p-6">
    <h3 className="font-semibold mb-4 flex items-center gap-2">
      <Users size={16} /> {title}
    </h3>
    {children}
  </div>
);

const Timeline = ({ title, subtitle, time, desc }) => (
  <div className="border-l-2 border-emerald-200 pl-4 mb-4">
    <p className="font-medium">{title}</p>
    {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    {time && <p className="text-xs text-gray-500">{time}</p>}
    {desc && <p className="text-sm mt-1">{desc}</p>}
  </div>
);

const ActionBox = ({ children }) => (
  <div className="bg-white border rounded-2xl p-4 flex flex-col gap-3">
    {children}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);

const Textarea = (props) => (
  <textarea
    {...props}
    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);

const FormField = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {children}
  </div>
);

const Primary = ({ children, ...props }) => (
  <button
    {...props}
    className="w-full rounded-xl bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
  >
    {children}
  </button>
);

const Success = ({ children, ...props }) => (
  <button
    {...props}
    className="w-full rounded-xl bg-emerald-600 text-white py-2.5 text-sm font-medium hover:bg-emerald-700 flex items-center justify-center gap-2"
  >
    {children}
  </button>
);

const Danger = ({ children, ...props }) => (
  <button
    {...props}
    className="w-full rounded-xl bg-red-600 text-white py-2.5 text-sm font-medium hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50"
  >
    {children}
  </button>
);

const TextButton = ({ children, ...props }) => (
  <button
    {...props}
    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
  >
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
        className="absolute top-3 right-4 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
    </div>
  </div>
);

const ModalActions = ({ children }) => (
  <div className="flex justify-end gap-3 mt-6">{children}</div>
);
