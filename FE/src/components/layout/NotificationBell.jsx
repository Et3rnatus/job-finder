import { useEffect, useRef, useState } from "react";
import { getMyNotifications, markAsRead } from "../../services/notificationService";
import { useNavigate } from "react-router-dom";

const POLL_INTERVAL = 20000; 

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const fetchNotifications = async () => {
    try {
      const data = await getMyNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("GET NOTIFICATIONS ERROR:", error);
    }
  };


  useEffect(() => {
    if (!token || role !== "employer") return;

    fetchNotifications();

    intervalRef.current = setInterval(fetchNotifications, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [token, role]);


  useEffect(() => {
    if (!open || !token || role !== "employer") return;
    fetchNotifications();
  }, [open, token, role]);

  const handleClickNotification = async (noti) => {
    try {
      if (!noti.is_read) {
        await markAsRead(noti.id);
      }

 
      setNotifications(prev =>
        prev.map(n =>
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
  title={noti.title} 
  className={`px-4 py-3 cursor-pointer hover:bg-gray-100 flex items-center gap-3 ${
    noti.is_read ? "text-gray-500" : "text-gray-800"
  }`}
>

  {!noti.is_read && (
    <span className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0" />
  )}


  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2 text-sm">
    
      <span className="font-semibold truncate max-w-[140px]">
        {noti.title}
      </span>

      
      <span className="text-gray-600 font-normal">
        {noti.message}
      </span>
    </div>
  </div>


  <span className="text-xs text-gray-400 whitespace-nowrap">
    {noti.created_at
      ? new Date(noti.created_at).toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
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
