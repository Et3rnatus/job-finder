import { useEffect, useState } from "react";
import ApplyForm from "./ApplyForm";

function ApplyButton({ job }) {
  const storageKey = `applied_job_${job.id}`;

  // 🔑 khởi tạo state từ localStorage
  const [applied, setApplied] = useState(() => {
    return localStorage.getItem(storageKey) === "true";
  });

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (applied) return;

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      alert("Vui lòng đăng nhập để ứng tuyển");
      return;
    }

    if (role !== "candidate") {
      alert("Chỉ ứng viên mới có thể ứng tuyển");
      return;
    }

    setOpen(true);
  };

  return (
    <>
      {/* 🔘 APPLY BUTTON */}
      <button
        onClick={handleOpen}
        disabled={applied}
        className={`
          w-full py-3 rounded-lg font-semibold
          ${
            applied
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }
        `}
      >
        {applied ? "Đã ứng tuyển" : "Ứng tuyển ngay"}
      </button>

      {/* ===== MODAL ===== */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-2xl relative">
            {/* ❌ CLOSE */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>

            <ApplyForm
              jobId={job.id}
              jobTitle={job.title}
              onSuccess={() => {
                // ✅ LƯU TRẠNG THÁI VÀO LOCALSTORAGE
                localStorage.setItem(storageKey, "true");
                setApplied(true);
                setOpen(false);
              }}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ApplyButton;
