import { useEffect, useRef, useState } from "react";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteReadNotifications,
} from "../../services/notificationService";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  Trash2,
  Loader2,
  Sparkles,
} from "lucide-react";

const POLL_INTERVAL = 20000;

/* =====================
   GROUP BY DATE
===================== */
const groupNotificationsByDate = (notifications) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const formatDate = (date) =>
    date.toLocaleDateString("vi-VN");

  return notifications.reduce((groups, noti) => {
    const notiDate = new Date(noti.created_at);
    let label = "";

    if (notiDate.toDateString() === today.toDateString()) {
      label = "Hôm nay";
    } else if (
      notiDate.toDateString() === yesterday.toDateString()
    ) {
      label = "Hôm qua";
    } else {
      label = formatDate(notiDate);
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(noti);

    return groups;
  }, {});
};

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const intervalRef = useRef(null);
  const containerRef = useRef(null);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const getNotificationSource = (type) => {
  switch (type) {
    case "NEW_APPLICATION":
      return "Thông báo có ứng viên ứng tuyển";
    case "job_approved":
    case "job_rejected":
      return "Thông báo từ Admin";
    default:
      return "Thông báo hệ thống";
  }
};

  const unreadCount = notifications.filter(
    (n) => Number(n.is_read) === 0
  ).length;

  const readCount = notifications.filter(
    (n) => Number(n.is_read) === 1
  ).length;

  const groupedNotifications =
    groupNotificationsByDate(notifications);

  const fetchNotifications = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await getMyNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("GET NOTIFICATIONS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     POLLING
  ===================== */
  useEffect(() => {
    if (!token) return;

    fetchNotifications();
    intervalRef.current = setInterval(
      () => fetchNotifications(true),
      POLL_INTERVAL
    );

    return () => clearInterval(intervalRef.current);
  }, [token]);

  /* =====================
     CLICK OUTSIDE
  ===================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    if (open)
      document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, [open]);

  /* =====================
     CLICK NOTIFICATION
  ===================== */
  const handleClickNotification = async (noti) => {
    try {
      if (!noti.is_read) {
        await markAsRead(noti.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === noti.id ? { ...n, is_read: 1 } : n
          )
        );
      }

     if (role === "employer") {
  // Ứng viên nộp hồ sơ → vẫn vào danh sách ứng viên của job
  if (noti.type === "NEW_APPLICATION" && noti.related_id) {
    navigate(`/employer/jobs/${noti.related_id}/applications`);
  } 
  // Admin duyệt / từ chối job → về trang job đã đăng
  else if (
    noti.type === "job_approved" ||
    noti.type === "job_rejected"
  ) {
    navigate("/employer/jobs"); // 👈 TRANG JOB ĐÃ ĐĂNG
  } 
  else {
    navigate("/employer/jobs");
  }

  setOpen(false);
  return;
}


      if (role === "candidate") {
        // ✅ FIX ĐÚNG: luôn về trang CÔNG VIỆC ĐÃ ỨNG TUYỂN
        navigate("/candidate/applications");
      }

      setOpen(false);
    } catch (error) {
      console.error("CLICK NOTIFICATION ERROR:", error);
    }
  };

  /* =====================
     MARK ALL READ
  ===================== */
  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    try {
      setProcessing(true);
      await markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: 1 }))
      );
    } finally {
      setProcessing(false);
    }
  };

  /* =====================
     DELETE READ
  ===================== */
  const handleDeleteRead = async () => {
    if (readCount === 0) return;
    if (!window.confirm("Xóa tất cả thông báo đã đọc?"))
      return;

    try {
      setProcessing(true);
      await deleteReadNotifications();
      setNotifications((prev) =>
        prev.filter((n) => Number(n.is_read) === 0)
      );
    } finally {
      setProcessing(false);
    }
  };

  if (!token) return null;

  return (
    <div ref={containerRef} className="relative">
      {/* =====================
          BELL BUTTON
      ===================== */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          relative w-10 h-10 rounded-full
          flex items-center justify-center
          hover:bg-gray-100 transition
        "
      >
        <Bell className="w-5 h-5 text-gray-700" />

        {unreadCount > 0 && (
          <span
            className="
              absolute -top-1 -right-1
              min-w-[18px] h-[18px]
              px-1
              flex items-center justify-center
              bg-red-600 text-white
              text-[10px] font-semibold
              rounded-full
            "
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* =====================
          DROPDOWN
      ===================== */}
      {open && (
        <div
          className="
            absolute right-0 mt-3 w-[420px]
            bg-white border border-gray-200
            rounded-3xl shadow-xl
            z-50 overflow-hidden
            animate-fade-in
          "
        >
          {/* HEADER */}
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h4 className="font-semibold text-gray-900">
                Thông báo
              </h4>
            </div>

            <div className="flex gap-3 text-xs">
              <button
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0 || processing}
                className="
                  flex items-center gap-1
                  text-emerald-600 hover:text-emerald-700
                  disabled:opacity-40
                "
              >
                <CheckCheck className="w-4 h-4" />
                Đã đọc
              </button>

              <button
                onClick={handleDeleteRead}
                disabled={readCount === 0 || processing}
                className="
                  flex items-center gap-1
                  text-red-600 hover:text-red-700
                  disabled:opacity-40
                "
              >
                <Trash2 className="w-4 h-4" />
                Xóa
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="max-h-[420px] overflow-y-auto">
            {loading && (
              <div className="py-16 flex flex-col items-center gap-3 text-gray-500">
                <Loader2
                  className="animate-spin text-emerald-600"
                  size={22}
                />
                <span className="text-sm">
                  Đang tải thông báo...
                </span>
              </div>
            )}

            {!loading &&
              Object.keys(groupedNotifications).length ===
                0 && (
                <div className="py-16 text-center text-sm text-gray-500">
                  Không có thông báo
                </div>
              )}

            {!loading &&
              Object.entries(groupedNotifications).map(
                ([dateLabel, items]) => (
                  <div key={dateLabel}>
                    {/* DATE */}
                    <div className="px-5 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                      {dateLabel}
                    </div>

                    {/* ITEMS */}
                      {items.map((noti) => (
                        <div
                          key={noti.id}
                          onClick={() =>
                            handleClickNotification(noti)
                          }
                          className={`
                            px-5 py-4 flex gap-4 cursor-pointer
                            transition
                            ${
                              Number(noti.is_read) === 1
                                ? "hover:bg-gray-50"
                                : "bg-emerald-50/60 hover:bg-emerald-50"
                            }
                          `}
                        >
                          {Number(noti.is_read) === 0 && (
                            <span className="w-2 h-2 mt-2 bg-emerald-600 rounded-full" />
                          )}

                          <div className="flex-1 min-w-0">
  <p className="text-sm font-semibold text-gray-900 truncate">
    {noti.title}
  </p>

  <p className="text-sm text-gray-600 line-clamp-2">
    {noti.message}
  </p>

  {/* 👇 DÒNG PHÂN BIỆT LOẠI THÔNG BÁO */}
  <p className="mt-1 text-xs text-gray-400 italic">
    {getNotificationSource(noti.type)}
  </p>
</div>


                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {new Date(
                            noti.created_at
                          ).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span> 
                      </div>
                    ))}
                  </div>
                )
              )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
