import { useNavigate } from "react-router-dom";

function EmployerSidebarTool({ setMode, setProfileMode }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    sessionStorage.removeItem("employerProfileModalShown");
    navigate("/login");
  };

  const handleProfileClick = () => {
    setMode("profile");
    if (setProfileMode) {
      setProfileMode("view"); // 🔥 luôn quay về VIEW
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Quản lý tuyển dụng
      </h3>

      <ul className="space-y-2 text-sm">
        <li
          onClick={handleProfileClick}
          className="px-3 py-2 rounded cursor-pointer text-gray-700 hover:bg-gray-100"
        >
          Hồ sơ công ty
        </li>

        <li
          onClick={() => setMode("jobs")}
          className="px-3 py-2 rounded cursor-pointer text-gray-700 hover:bg-gray-100"
        >
          Việc làm đã đăng
        </li>

        <li
          onClick={() => setMode("create")}
          className="px-3 py-2 rounded cursor-pointer text-gray-700 hover:bg-gray-100"
        >
          Đăng tuyển mới
        </li>

        <hr className="my-3" />

        <li
          onClick={handleLogout}
          className="px-3 py-2 rounded cursor-pointer text-red-600 hover:bg-red-50 font-medium"
        >
          Đăng xuất
        </li>
      </ul>
    </div>
  );
}

export default EmployerSidebarTool;
