import {
  Shield,
  UserX,
  UserCheck,
} from "lucide-react";

export default function UserTable({
  users,
  onToggleStatus,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        {/* ===== HEADER ===== */}
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 text-left font-semibold text-gray-700">
              Email
            </th>
            <th className="p-4 text-left font-semibold text-gray-700">
              Role
            </th>
            <th className="p-4 text-left font-semibold text-gray-700">
              Status
            </th>
            <th className="p-4 text-right font-semibold text-gray-700">
              Action
            </th>
          </tr>
        </thead>

        {/* ===== BODY ===== */}
        <tbody className="divide-y">
          {users.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="p-10 text-center text-gray-500"
              >
                Không có người dùng
              </td>
            </tr>
          )}

          {users.map((user) => {
            const isAdmin = user.role === "admin";
            const isActive = user.status === "active";

            return (
              <tr
                key={user.id}
                className="
                  group
                  hover:bg-gray-50
                  transition
                "
              >
                {/* ===== EMAIL ===== */}
                <td className="p-4">
                  <p className="font-medium text-gray-900">
                    {user.email}
                  </p>
                </td>

                {/* ===== ROLE ===== */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="capitalize text-gray-700">
                      {user.role}
                    </span>

                    {isAdmin && (
                      <span
                        className="
                          inline-flex items-center gap-1
                          px-2 py-0.5
                          rounded-full
                          text-xs font-semibold
                          bg-indigo-100 text-indigo-700
                          border border-indigo-200
                        "
                      >
                        <Shield className="w-3 h-3" />
                        Admin
                      </span>
                    )}
                  </div>
                </td>

                {/* ===== STATUS ===== */}
                <td className="p-4">
                  <span
                    className={`
                      inline-flex items-center gap-1.5
                      px-3 py-1
                      rounded-full
                      text-xs font-semibold
                      border
                      ${
                        isActive
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }
                    `}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? "bg-green-600" : "bg-red-600"
                      }`}
                    />
                    {isActive ? "Active" : "Blocked"}
                  </span>
                </td>

                {/* ===== ACTION ===== */}
                <td className="p-4">
                  <div className="flex justify-end">
                    {isAdmin ? (
                      <span className="text-xs text-gray-400 italic">
                        Không thể thao tác
                      </span>
                    ) : (
                      <button
                        onClick={() => onToggleStatus(user)}
                        className={`
                          inline-flex items-center gap-2
                          px-3 py-1.5
                          rounded-lg
                          text-xs font-semibold
                          text-white
                          transition
                          active:scale-95
                          ${
                            isActive
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-green-600 hover:bg-green-700"
                          }
                        `}
                      >
                        {isActive ? (
                          <>
                            <UserX className="w-4 h-4" />
                            Block
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4" />
                            Unblock
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
