import { useEffect, useState } from "react";
import { getMyNotifications, markAsRead } from "../../services/notificationService";
import { useNavigate } from "react-router-dom";

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // 🔔 Fetch notification khi mở bell (và chỉ khi đã login)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !open) return;

    fetchNotifications();
  }, [open]);

  const fetchNotifications = async () => {
    try {
      const data = await getMyNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error("GET NOTIFICATIONS ERROR:", error);
    }
  };

  const handleClickNotification = async (noti) => {
    try {
      // 1️⃣ Mark as read (BE)
      if (!noti.is_read) {
        await markAsRead(noti.id);
      }

      // 2️⃣ Update state (FE)
      setNotifications(prev =>
        prev.map(n =>
          n.id === noti.id ? { ...n, is_read: 1 } : n
        )
      );

      // 3️⃣ Điều hướng theo role + related_id
      const role = localStorage.getItem("role");

      if (noti.related_id) {
        if (role === "candidate") {
          navigate(`/applications/${noti.related_id}`);
        } else if (role === "employer") {
          navigate(`/employer/applications/${noti.related_id}`);
        }
      }

      setOpen(false);
    } catch (error) {
      console.error("CLICK NOTIFICATION ERROR:", error);
    }
  };

  return (
    <div className="relative">
      {/* 🔔 ICON */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="relative text-gray-600 hover:text-gray-800"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
          <div className="p-3 font-semibold border-b">
            Thông báo
          </div>

          {notifications.length === 0 && (
            <p className="p-3 text-sm text-gray-500">
              Không có thông báo
            </p>
          )}

          <ul className="max-h-80 overflow-y-auto">
            {notifications.map((noti) => (
              <li
                key={noti.id}
                onClick={() => handleClickNotification(noti)}
                className={`px-4 py-3 cursor-pointer text-sm hover:bg-gray-100 ${
                  noti.is_read ? "text-gray-500" : "font-semibold"
                }`}
              >
                <p>{noti.title}</p>
                <p className="text-xs text-gray-400">
                  {noti.created_at
                    ? new Date(noti.created_at).toLocaleString()
                    : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
