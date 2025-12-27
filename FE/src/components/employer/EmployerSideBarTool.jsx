import { useNavigate } from "react-router-dom";

function EmployerSidebarTool({ setMode }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Xóa auth info
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // (nếu bạn có lưu thêm)
    // localStorage.removeItem("user");

    // 2. Điều hướng về login
    navigate("/login");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-4">
        Công cụ nhà tuyển dụng
      </h3>

      <ul className="space-y-3 text-gray-600">
        <li
          className="cursor-pointer hover:text-blue-600"
          onClick={() => setMode("profile")}
        >
          Hồ sơ công ty
        </li>

        <li
          className="cursor-pointer hover:text-blue-600"
          onClick={() => setMode("jobs")}
        >
          Việc làm đã đăng
        </li>

        <li
          className="cursor-pointer hover:text-blue-600"
          onClick={() => setMode("create")}
        >
          Đăng tuyển mới
        </li>

        {/* Divider */}
        <hr className="my-3" />

        {/* LOGOUT */}
        <li
          className="cursor-pointer text-red-600 hover:text-red-700 font-semibold"
          onClick={handleLogout}
        >
          Đăng xuất
        </li>
      </ul>
    </div>
  );
}

export default EmployerSidebarTool;
