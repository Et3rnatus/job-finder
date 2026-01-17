import { useEffect, useMemo, useState } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  MessageCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { getApplicantsByJob } from "../services/applicationService";

/* =====================
   CONSTANTS
===================== */
const FILTERS = {
  ALL: "all",
  PENDING: "pending",
  INTERVIEW: "interview",
  APPROVED: "approved",
  REJECTED: "rejected",
};

const statusConfig = {
  pending: {
    label: "Chờ duyệt",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: <Clock size={14} />,
  },
  interview: {
    label: "Mời phỏng vấn",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <MessageCircle size={14} />,
  },
  approved: {
    label: "Đã duyệt",
    badge: "bg-green-100 text-green-700 border-green-200",
    icon: <CheckCircle2 size={14} />,
  },
  rejected: {
    label: "Từ chối",
    badge: "bg-red-100 text-red-700 border-red-200",
    icon: <XCircle size={14} />,
  },
};

export default function EmployerApplicantsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const from = location.state?.from;
  const tabFromUrl = searchParams.get("tab");

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(
    Object.values(FILTERS).includes(tabFromUrl)
      ? tabFromUrl
      : FILTERS.ALL
  );

  /* =====================
     FETCH DATA
  ===================== */
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const res = await getApplicantsByJob(jobId);
        setApplicants(Array.isArray(res) ? res : []);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId]);

  /* =====================
     SUMMARY
  ===================== */
  const summary = useMemo(
    () => ({
      total: applicants.length,
      pending: applicants.filter((a) => a.status === "pending").length,
      interview: applicants.filter((a) => a.status === "interview").length,
      approved: applicants.filter((a) => a.status === "approved").length,
      rejected: applicants.filter((a) => a.status === "rejected").length,
    }),
    [applicants]
  );

  const filteredApplicants = useMemo(() => {
    if (filter === FILTERS.ALL) return applicants;
    return applicants.filter((a) => a.status === filter);
  }, [filter, applicants]);

  const changeFilter = (key) => {
    setFilter(key);
    searchParams.set("tab", key);
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* =====================
          HEADER
      ===================== */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
            <Users size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Danh sách ứng viên
            </h1>
            <p className="text-sm text-gray-500">
              Quản lý & đánh giá hồ sơ ứng tuyển
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Tin tuyển dụng ID: <span className="font-medium">#{jobId}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            from ? navigate(from) : navigate("/employer/jobs")
          }
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Quay lại
        </button>
      </div>

      {/* =====================
          SUMMARY
      ===================== */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Summary
          label="Tổng"
          value={summary.total}
          active={filter === FILTERS.ALL}
          onClick={() => changeFilter(FILTERS.ALL)}
        />
        <Summary
          label="Chờ duyệt"
          value={summary.pending}
          color="yellow"
          active={filter === FILTERS.PENDING}
          onClick={() => changeFilter(FILTERS.PENDING)}
        />
        <Summary
          label="Mời PV"
          value={summary.interview}
          color="blue"
          active={filter === FILTERS.INTERVIEW}
          onClick={() => changeFilter(FILTERS.INTERVIEW)}
        />
        <Summary
          label="Đã duyệt"
          value={summary.approved}
          color="green"
          active={filter === FILTERS.APPROVED}
          onClick={() => changeFilter(FILTERS.APPROVED)}
        />
        <Summary
          label="Từ chối"
          value={summary.rejected}
          color="red"
          active={filter === FILTERS.REJECTED}
          onClick={() => changeFilter(FILTERS.REJECTED)}
        />
      </div>

      {/* =====================
          LIST
      ===================== */}
      <div className="bg-white border border-gray-200 rounded-2xl divide-y shadow-sm">
        {loading && (
          <div className="p-12 flex justify-center text-gray-500">
            <Loader2 className="animate-spin" />
          </div>
        )}

        {!loading && filteredApplicants.length === 0 && (
          <div className="p-12 text-center text-gray-500 space-y-2">
            <p className="font-medium">
              Chưa có ứng viên ở trạng thái này
            </p>
            <p className="text-sm">
              Hãy thử chọn trạng thái khác hoặc chờ ứng viên mới.
            </p>
          </div>
        )}

        {!loading &&
          filteredApplicants.map((app) => {
            const fullName =
              app.snapshot?.basic?.full_name || "Ứng viên";
            const skills = app.snapshot?.skills || [];
            const status = statusConfig[app.status];

            return (
              <div
                key={app.application_id}
                className="p-5 flex justify-between items-center hover:bg-gray-50 transition"
              >
                {/* LEFT */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold">
                    {fullName.charAt(0)}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {fullName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Nộp ngày{" "}
                      {new Date(app.applied_at).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>

                    {skills.length > 0 && (
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {skills.slice(0, 3).map((s, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                          >
                            {s}
                          </span>
                        ))}
                        {skills.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${status.badge}`}
                  >
                    {status.icon}
                    {status.label}
                  </span>

                  <button
                    onClick={() =>
                      navigate(
                        `/employer/applications/${app.application_id}`,
                        {
                          state: {
                            from: `/employer/jobs/${jobId}/applicants`,
                          },
                        }
                      )
                    }
                    className="px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Xem hồ sơ
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* PIPELINE NOTE */}
      <div className="text-xs text-gray-400 italic text-center">
        Quy trình tuyển dụng: Nộp hồ sơ → Phỏng vấn → Duyệt / Từ chối
      </div>
    </div>
  );
}

/* =====================
   UI COMPONENTS
===================== */
function Summary({ label, value, color = "gray", active, onClick }) {
  const map = {
    gray: "text-gray-700",
    yellow: "text-yellow-700",
    blue: "text-blue-700",
    green: "text-green-700",
    red: "text-red-700",
  };

  return (
    <button
      onClick={onClick}
      className={`
        bg-white border rounded-2xl p-4 text-center transition
        hover:shadow-md
        ${active ? "border-green-600 ring-2 ring-green-200" : "border-gray-200"}
      `}
    >
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${map[color]}`}>
        {value}
      </p>
    </button>
  );
}
