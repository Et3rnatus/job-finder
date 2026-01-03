import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApplyForm from "./ApplyForm";
import {
  saveJob,
  unsaveJob,
  checkSavedJob,
} from "../../services/savedJobService";
import { checkAppliedJob } from "../../services/applicationService";

function ApplyButton({ job }) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!job) return null;

  /* =====================
     STATE
  ===================== */
  const [applied, setApplied] = useState(false);
  const [checkingApplied, setCheckingApplied] = useState(true);

  const [saved, setSaved] = useState(false);
  const [checkingSaved, setCheckingSaved] = useState(true);

  const [open, setOpen] = useState(false);

  /* =====================
     CHECK APPLIED
  ===================== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "candidate") {
      setCheckingApplied(false);
      return;
    }

    const fetchApplied = async () => {
      try {
        const res = await checkAppliedJob(job.id);
        setApplied(res.applied);
      } catch {
        setApplied(false);
      } finally {
        setCheckingApplied(false);
      }
    };

    fetchApplied();
  }, [job.id]);

  /* =====================
     CHECK SAVED
  ===================== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "candidate") {
      setCheckingSaved(false);
      return;
    }

    const fetchSaved = async () => {
      try {
        const res = await checkSavedJob(job.id);
        setSaved(res.saved);
      } catch {
        setSaved(false);
      } finally {
        setCheckingSaved(false);
      }
    };

    fetchSaved();
  }, [job.id]);

  /* =====================
     AUTO OPEN APPLY AFTER LOGIN
  ===================== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (
      location.state?.autoApply &&
      token &&
      role === "candidate" &&
      !applied
    ) {
      setOpen(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, applied, navigate]);

  /* =====================
     APPLY
  ===================== */
  const handleOpen = () => {
    if (applied) return;

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login", {
        state: {
          from: location.pathname,
          autoApply: true,
        },
      });
      return;
    }

    if (role !== "candidate") {
      alert("Chỉ ứng viên mới có thể ứng tuyển");
      return;
    }

    setOpen(true);
  };

  /* =====================
     SAVE / UNSAVE
  ===================== */
  const handleToggleSave = async (e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (role !== "candidate") {
      alert("Chỉ ứng viên mới có thể lưu công việc");
      return;
    }

    try {
      if (saved) {
        await unsaveJob(job.id);
        setSaved(false);
      } else {
        await saveJob(job.id);
        setSaved(true);
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Không thể lưu công việc");
    }
  };

  /* =====================
     RENDER
  ===================== */
  return (
    <>
      {/* ===== ACTION BAR ===== */}
      <div className="flex items-center gap-4">
        {/* APPLY BUTTON */}
        <button
          onClick={handleOpen}
          disabled={checkingApplied || applied}
          className={`
            flex-1 h-12 rounded-xl font-semibold text-base
            transition-all duration-200
            ${
              applied
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]"
            }
          `}
        >
          {checkingApplied
            ? "Đang kiểm tra..."
            : applied
            ? "Đã ứng tuyển"
            : "Ứng tuyển ngay"}
        </button>

        {/* SAVE BUTTON */}
        <button
          onClick={handleToggleSave}
          disabled={checkingSaved}
          className={`
            w-12 h-12 flex items-center justify-center
            rounded-xl border transition-all duration-200
            ${
              saved
                ? "border-green-600 bg-green-50 text-green-600"
                : "border-gray-300 text-gray-500 hover:border-green-600 hover:text-green-600"
            }
            active:scale-95
          `}
          title={saved ? "Bỏ lưu công việc" : "Lưu công việc"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={saved ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5
                 -1.935 0-3.597 1.126-4.312 2.733
                 -.715-1.607-2.377-2.733-4.313-2.733
                 C5.1 3.75 3 5.765 3 8.25
                 c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>

      {/* ===== APPLY MODAL ===== */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative overflow-hidden animate-scaleIn">
            {/* HEADER */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Ứng tuyển công việc
                </h2>
                <p className="text-sm text-gray-500 truncate">
                  {job.title}
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* BODY */}
            <div className="p-6">
              <ApplyForm
                jobId={job.id}
                jobTitle={job.title}
                onSuccess={() => {
                  setApplied(true);
                  setOpen(false);
                }}
                onClose={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ApplyButton;
