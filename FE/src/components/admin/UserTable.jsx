export default function UserTable({ users, onToggleStatus }) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 && (
            <tr>
              <td
                colSpan="4"
                className="p-4 text-center text-gray-500"
              >
                No users found
              </td>
            </tr>
          )}

          {users.map((user) => {
            const isAdmin = user.role === "admin";
            const isActive = user.status === "active";

            return (
              <tr key={user.id} className="border-t">
                <td className="p-3">{user.email}</td>

                <td className="p-3 capitalize">
                  {user.role}
                  {isAdmin && (
                    <span className="ml-2 text-xs text-gray-500">
                      (Admin)
                    </span>
                  )}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium
                      ${
                        isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="p-3">
                  {isAdmin ? (
                    <span className="text-gray-400 text-xs">
                      No action
                    </span>
                  ) : (
                    <button
                      onClick={() => onToggleStatus(user)}
                      className={`px-3 py-1 rounded text-xs text-white
                        ${
                          isActive
                            ? "bg-red-600"
                            : "bg-green-600"
                        }`}
                    >
                      {isActive ? "Block" : "Unblock"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
