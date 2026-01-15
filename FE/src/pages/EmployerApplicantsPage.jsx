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

  const summary = useMemo(() => ({
    total: applicants.length,
    pending: applicants.filter((a) => a.status === "pending").length,
    interview: applicants.filter((a) => a.status === "interview").length,
    approved: applicants.filter((a) => a.status === "approved").length,
    rejected: applicants.filter((a) => a.status === "rejected").length,
  }), [applicants]);

  const filteredApplicants = useMemo(() => {
    if (filter === FILTERS.ALL) return applicants;
    return applicants.filter((a) => a.status === filter);
  }, [filter, applicants]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* HEADER */}
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
          </div>
        </div>

        <button
          onClick={() => (from ? navigate(from) : navigate("/employer/jobs"))}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Quay lại
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Summary label="Tổng" value={summary.total} />
        <Summary label="Chờ duyệt" value={summary.pending} color="yellow" />
        <Summary label="Mời PV" value={summary.interview} color="blue" />
        <Summary label="Đã duyệt" value={summary.approved} color="green" />
        <Summary label="Từ chối" value={summary.rejected} color="red" />
      </div>

      {/* FILTER */}
      <div className="flex flex-wrap gap-2">
        {[
          ["Tất cả", FILTERS.ALL, summary.total],
          ["Chờ duyệt", FILTERS.PENDING, summary.pending],
          ["Mời PV", FILTERS.INTERVIEW, summary.interview],
          ["Đã duyệt", FILTERS.APPROVED, summary.approved],
          ["Từ chối", FILTERS.REJECTED, summary.rejected],
        ].map(([label, key, count]) => (
          <button
            key={key}
            disabled={count === 0}
            onClick={() => {
              setFilter(key);
              searchParams.set("tab", key);
              setSearchParams(searchParams);
            }}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition
              ${
                filter === key
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
              ${count === 0 ? "opacity-40 cursor-not-allowed" : ""}
            `}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="bg-white border border-gray-200 rounded-2xl divide-y shadow-sm">
        {loading && (
          <div className="p-12 flex justify-center text-gray-500">
            <Loader2 className="animate-spin" />
          </div>
        )}

        {!loading && filteredApplicants.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            Chưa có ứng viên phù hợp
          </div>
        )}

        {!loading &&
          filteredApplicants.map((app) => {
            const fullName =
              app.snapshot?.basic?.full_name || "Ứng viên";
            const status = statusConfig[app.status];

            return (
              <div
                key={app.application_id}
                className="p-5 flex justify-between items-center hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {fullName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Nộp ngày{" "}
                    {new Date(app.applied_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>

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
    </div>
  );
}

/* ===================== UI ===================== */
function Summary({ label, value, color = "gray" }) {
  const map = {
    gray: "bg-gray-100 text-gray-700",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${map[color]}`}>
        {value}
      </p>
    </div>
  );
}
