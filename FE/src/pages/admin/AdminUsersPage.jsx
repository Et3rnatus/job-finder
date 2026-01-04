import { useEffect, useState } from "react";
import {
  getUsers,
  updateUserStatus,
} from "../../services/adminService";
import UserTable from "../../components/admin/UserTable";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔑 admin đang đăng nhập
  const currentUserId = Number(localStorage.getItem("user_id"));

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res);
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
    // ❌ Không cho tự block chính mình
    if (user.id === currentUserId) {
      alert("Bạn không thể thay đổi trạng thái tài khoản của chính mình");
      return;
    }

    // ❌ Không cho block admin khác
    if (user.role === "admin") {
      alert("Không thể thay đổi trạng thái của admin");
      return;
    }

    const nextStatus =
      user.status === "active" ? "blocked" : "active";

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
      console.error("UPDATE USER STATUS ERROR:", error);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading users...</p>;
  }

  return (
    <div>
      {/* ===== TITLE ===== */}
      <h1 className="text-2xl font-bold mb-6">
        User Management
      </h1>

      {/* ===== USER TABLE ===== */}
      <UserTable
        users={users}
        onToggleStatus={toggleStatus}
      />
    </div>
  );
}
