import { useEffect, useState } from "react";
import {
  getUsers,
  updateUserStatus,
} from "../../services/adminService";
import {
  Users,
  Loader2,
  ShieldAlert,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";
import UserTable from "../../components/admin/UserTable";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const currentUserId = Number(
    localStorage.getItem("user_id")
  );

  /* =====================
     LOAD USERS
  ===================== */
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await getUsers();
      setUsers(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("GET ADMIN USERS ERROR:", err);
      setError(true);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* =====================
     TOGGLE STATUS
  ===================== */
  const toggleStatus = async (user) => {
    if (processingId) return;

    if (user.id === currentUserId) {
      alert(
        "Bạn không thể thay đổi trạng thái tài khoản của chính mình"
      );
      return;
    }

    if (user.role === "admin") {
      alert("Không thể thay đổi trạng thái của admin");
      return;
    }

    const nextStatus =
      user.status === "active" ? "blocked" : "active";

    const ok = window.confirm(
      `Bạn có chắc muốn ${
        nextStatus === "blocked" ? "khóa" : "mở"
      } tài khoản này?`
    );
    if (!ok) return;

    try {
      setProcessingId(user.id);
      await updateUserStatus(user.id, nextStatus);
      loadUsers();
    } catch (err) {
      console.error("UPDATE USER STATUS ERROR:", err);
      alert("Không thể cập nhật trạng thái người dùng");
    } finally {
      setProcessingId(null);
    }
  };

  /* =====================
     LOADING
  ===================== */
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-3xl p-20 flex flex-col items-center gap-4 text-gray-500 shadow-sm">
        <Loader2
          size={32}
          className="animate-spin text-emerald-600"
        />
        <p className="text-sm">
          Đang tải danh sách người dùng...
        </p>
      </div>
    );
  }

  /* =====================
     ERROR
  ===================== */
  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-3xl p-16 flex flex-col items-center gap-4 text-red-600 shadow-sm">
        <AlertTriangle size={32} />
        <p className="font-semibold">
          Không thể tải danh sách người dùng
        </p>
        <button
          onClick={loadUsers}
          className="
            mt-3 inline-flex items-center gap-2
            px-5 py-2 rounded-full
            text-sm font-semibold
            bg-red-50 text-red-600
            hover:bg-red-100
            transition
          "
        >
          <RefreshCcw size={14} />
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* =====================
          HEADER
      ===================== */}
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <Users size={26} />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            User Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý & kiểm soát tài khoản người dùng
          </p>
        </div>
      </div>

      {/* =====================
          WARNING NOTE
      ===================== */}
      <div className="bg-white border border-amber-200 rounded-2xl px-6 py-4 flex items-center gap-2 text-sm text-amber-700">
        <ShieldAlert size={16} />
        Không thể khóa tài khoản admin hoặc chính bạn
      </div>

      {/* =====================
          TABLE
      ===================== */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            Không có người dùng nào
          </div>
        ) : (
          <UserTable
            users={users}
            onToggleStatus={toggleStatus}
            processingId={processingId}
          />
        )}
      </div>
    </div>
  );
}
