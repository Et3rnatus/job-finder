import { useEffect, useState } from "react";
import {
  getUsers,
  updateUserStatus,
} from "../../services/adminService";
import {
  Users,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import UserTable from "../../components/admin/UserTable";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = Number(
    localStorage.getItem("user_id")
  );

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("GET ADMIN USERS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleStatus = async (user) => {
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
      user.status === "active"
        ? "blocked"
        : "active";

    if (
      !window.confirm(
        `Bạn có chắc muốn ${
          nextStatus === "blocked" ? "khóa" : "mở"
        } tài khoản này?`
      )
    ) {
      return;
    }

    try {
      await updateUserStatus(user.id, nextStatus);
      loadUsers();
    } catch (error) {
      console.error(
        "UPDATE USER STATUS ERROR:",
        error
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-3xl p-16 flex flex-col items-center gap-4 text-gray-500">
        <Loader2 size={28} className="animate-spin" />
        Đang tải danh sách người dùng...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
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

      <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 flex items-center gap-2 text-sm text-gray-600">
        <ShieldAlert size={16} />
        Không thể khóa tài khoản admin hoặc chính bạn
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        <UserTable
          users={users}
          onToggleStatus={toggleStatus}
        />
      </div>
    </div>
  );
}
