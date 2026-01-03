import LoginForm from "../components/auth/LoginForm";

function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* =====================
          LEFT - BRANDING
      ===================== */}
      <div className="hidden md:flex bg-green-700 text-white flex-col justify-center px-12">
        <h1 className="text-3xl font-bold mb-4">
          Chào mừng bạn quay trở lại
        </h1>
        <p className="text-lg opacity-90 max-w-md">
          Đăng nhập để tiếp tục tìm kiếm cơ hội nghề nghiệp
          hoặc quản lý hoạt động tuyển dụng của bạn.
        </p>

        <ul className="mt-8 space-y-3 text-sm opacity-90">
          <li>✔ Hàng nghìn việc làm chất lượng</li>
          <li>✔ Nhà tuyển dụng uy tín</li>
          <li>✔ Ứng tuyển nhanh chóng</li>
        </ul>
      </div>

      {/* =====================
          RIGHT - FORM
      ===================== */}
      <div className="flex items-center justify-center bg-gray-100 px-4">
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
