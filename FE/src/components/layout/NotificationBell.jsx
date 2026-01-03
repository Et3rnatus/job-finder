import { useEffect, useRef, useState } from "react";
import {
  getMyNotifications,
  markAsRead,
} from "../../services/notificationService";
import { useNavigate } from "react-router-dom";

const POLL_INTERVAL = 20000;

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const unreadCount = notifications.filter(
    (n) => !n.is_read
  ).length;

  const fetchNotifications = async () => {
    try {
      const data = await getMyNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("GET NOTIFICATIONS ERROR:", error);
    }
  };

  /* ===== POLLING ===== */
  useEffect(() => {
    if (!token || role !== "employer") return;

    fetchNotifications();
    intervalRef.current = setInterval(
      fetchNotifications,
      POLL_INTERVAL
    );

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [token, role]);

  /* ===== REFRESH WHEN OPEN ===== */
  useEffect(() => {
    if (!open || !token || role !== "employer") return;
    fetchNotifications();
  }, [open, token, role]);

  /* ===== CLICK NOTIFICATION ===== */
  const handleClickNotification = async (noti) => {
    try {
      if (!noti.is_read) {
        await markAsRead(noti.id);
      }

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === noti.id ? { ...n, is_read: 1 } : n
        )
      );

      navigate("/account/employer");
      setOpen(false);
    } catch (error) {
      console.error("CLICK NOTIFICATION ERROR:", error);
    }
  };

  if (role !== "employer") return null;

  return (
    <div className="relative">
      {/* ===== BELL ===== */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          relative w-10 h-10
          flex items-center justify-center
          rounded-full
          text-gray-600 hover:text-gray-900
          hover:bg-gray-100 transition
        "
      >
        🔔
        {unreadCount > 0 && (
          <span
            className="
              absolute -top-1 -right-1
              min-w-[18px] h-[18px]
              flex items-center justify-center
              bg-red-600 text-white text-xs
              rounded-full px-1
            "
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* ===== DROPDOWN ===== */}
      {open && (
        <div
          className="
            absolute right-0 mt-3 w-96
            bg-white border border-gray-200
            rounded-xl shadow-xl z-50
            overflow-hidden
          "
        >
          {/* HEADER */}
          <div className="px-4 py-3 border-b font-semibold text-gray-800">
            Thông báo
          </div>

          {/* EMPTY */}
          {notifications.length === 0 && (
            <p className="px-4 py-6 text-sm text-gray-500 text-center">
              Không có thông báo
            </p>
          )}

          {/* LIST */}
          <ul className="max-h-96 overflow-y-auto">
            {notifications.map((noti) => (
              <li
                key={noti.id}
                onClick={() => handleClickNotification(noti)}
                title={noti.title}
                className={`
                  px-4 py-3 cursor-pointer
                  flex gap-3 items-start
                  hover:bg-gray-50 transition
                  ${
                    noti.is_read
                      ? "text-gray-500"
                      : "text-gray-900 bg-green-50/40"
                  }
                `}
              >
                {/* DOT */}
                {!noti.is_read && (
                  <span className="w-2 h-2 mt-2 bg-green-600 rounded-full flex-shrink-0" />
                )}

                {/* CONTENT */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {noti.title}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {noti.message}
                  </p>
                </div>

                {/* TIME */}
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {noti.created_at
                    ? new Date(noti.created_at).toLocaleString(
                        "vi-VN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                        }
                      )
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
