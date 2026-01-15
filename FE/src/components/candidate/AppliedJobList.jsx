import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyApplications,
  cancelApplication,
  deleteApplicationHistory,
} from "../../services/applicationService";
import ApplyForm from "../job_detail/ApplyForm";
import {
  Briefcase,
  Building2,
  CalendarDays,
  XCircle,
  RotateCcw,
  Loader2,
  Eye,
  Trash2,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Ban,
} from "lucide-react";

/* =====================
   STATUS MAP
===================== */
const statusMap = {
  pending: {
    text: "Đang chờ xử lý",
    icon: Clock,
    badge:
      "bg-amber-50 text-amber-700 border-amber-200",
  },
  approved: {
    text: "Được chấp nhận",
    icon: CheckCircle2,
    badge:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  rejected: {
    text: "Bị từ chối",
    icon: Ban,
    badge:
      "bg-red-50 text-red-700 border-red-200",
  },
  cancelled: {
    text: "Đã hủy",
    icon: XCircle,
    badge:
      "bg-gray-50 text-gray-600 border-gray-200",
  },
};

export default function AppliedJobList() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showApplyForm, setShowApplyForm] =
    useState(false);
  const [selectedJob, setSelectedJob] =
    useState(null);

  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    fetchAppliedJobs();
    // eslint-disable-next-line
  }, []);

  const fetchAppliedJobs = async (filters = {}) => {
    try {
      setLoading(true);
      const data = await getMyApplications(filters);
      setJobs(
        Array.isArray(data)
          ? data.filter(
              (i) => i && i.id && i.job_id
            )
          : []
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchAppliedJobs({
      keyword,
      status: statusFilter,
    });
  };

  const handleCancel = (applicationId) => {
    setConfirm({
      title: "Hủy ứng tuyển",
      message:
        "Bạn có chắc chắn muốn hủy ứng tuyển công việc này?",
      onConfirm: async () => {
        try {
          setProcessing(true);
          await cancelApplication(applicationId);
          fetchAppliedJobs({
            keyword,
            status: statusFilter,
          });
        } finally {
          setProcessing(false);
          setConfirm(null);
        }
      },
    });
  };

  const handleDeleteAllHistory = () => {
    if (!jobs.length) return;

    setConfirm({
      title: "Xóa toàn bộ lịch sử",
      message:
        "Toàn bộ lịch sử ứng tuyển sẽ bị xóa vĩnh viễn.",
      onConfirm: async () => {
        try {
          setProcessing(true);
          await deleteApplicationHistory();
          setJobs([]);
        } finally {
          setProcessing(false);
          setConfirm(null);
        }
      },
    });
  };

  const handleReApply = (job) => {
    setSelectedJob(job);
    setShowApplyForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Loader2 className="animate-spin" size={16} />
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 bg-white border border-gray-200 rounded-3xl shadow-sm">
        {/* HEADER */}
        <div className="flex flex-wrap justify-between gap-4 p-6 border-b">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              ← Quay lại
            </button>
            <h2 className="mt-1 text-xl font-semibold">
              Công việc đã ứng tuyển
            </h2>
            <p className="text-sm text-gray-500">
              Quản lý toàn bộ lịch sử ứng tuyển
            </p>
          </div>

          <button
            disabled={!jobs.length || processing}
            onClick={handleDeleteAllHistory}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-300 rounded-xl hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 size={16} />
            Xóa tất cả
          </button>
        </div>

        {/* FILTER */}
        <div className="flex flex-wrap gap-3 p-6 border-b bg-gray-50">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={keyword}
              onChange={(e) =>
                setKeyword(e.target.value)
              }
              placeholder="Tìm theo công việc hoặc công ty"
              className="pl-9 pr-3 py-2 w-64 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Đang chờ</option>
            <option value="approved">
              Được chấp nhận
            </option>
            <option value="rejected">Bị từ chối</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          <button
            onClick={handleSearch}
            className="px-5 py-2 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
          >
            Tìm kiếm
          </button>
        </div>

        {/* LIST */}
        <div className="p-6 space-y-4">
          {!jobs.length && (
            <div className="py-20 text-center text-gray-500">
              <Briefcase
                size={40}
                className="mx-auto mb-3 opacity-30"
              />
              <p>Chưa có lịch sử ứng tuyển</p>
            </div>
          )}

          {jobs.map((job) => {
            const status =
              statusMap[job.status] ||
              statusMap.cancelled;
            const Icon = status.icon;

            return (
              <div
                key={job.id}
                className="rounded-2xl border border-gray-200 p-5 hover:shadow-md transition bg-white"
              >
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      <Briefcase size={16} />
                      {job.job_title}
                    </h4>
                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <Building2 size={15} />
                      {job.company_name}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      <CalendarDays size={14} />
                      {new Date(
                        job.applied_at
                      ).toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${status.badge}`}
                  >
                    <Icon size={14} />
                    {status.text}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 mt-4 text-sm">
                  <button
                    onClick={() =>
                      navigate(`/jobs/${job.job_id}`)
                    }
                    className="inline-flex items-center gap-1 text-gray-700 hover:text-indigo-600"
                  >
                    <Eye size={14} />
                    Xem chi tiết
                  </button>

                  {job.status === "pending" && (
                    <button
                      onClick={() =>
                        handleCancel(job.id)
                      }
                      className="inline-flex items-center gap-1 text-red-600 hover:underline"
                    >
                      <XCircle size={14} />
                      Hủy ứng tuyển
                    </button>
                  )}

                  {job.status === "cancelled" && (
                    <button
                      onClick={() =>
                        handleReApply(job)
                      }
                      className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                    >
                      <RotateCcw size={14} />
                      Ứng tuyển lại
                    </button>
                  )}
                </div>

                {job.status === "rejected" &&
                  job.reject_reason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                      <p className="font-medium">
                        Lý do từ chối
                      </p>
                      <p className="mt-1">
                        {job.reject_reason}
                      </p>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </div>

      {showApplyForm && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-xl">
            <ApplyForm
              jobId={selectedJob.job_id}
              jobTitle={selectedJob.job_title}
              onClose={() =>
                setShowApplyForm(false)
              }
              onSuccess={() => {
                setShowApplyForm(false);
                fetchAppliedJobs({
                  keyword,
                  status: statusFilter,
                });
              }}
            />
          </div>
        </div>
      )}

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-xl">
            <AlertTriangle
              size={40}
              className="mx-auto text-red-600 mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">
              {confirm.title}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {confirm.message}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="px-4 py-2 rounded-xl border hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={confirm.onConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
