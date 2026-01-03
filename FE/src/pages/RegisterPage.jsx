import RegisterForm from "../components/auth/RegisterForm";

function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* =====================
          LEFT - BRANDING
      ===================== */}
      <div className="hidden md:flex bg-green-700 text-white flex-col justify-center px-12">
        <h1 className="text-3xl font-bold mb-4">
          Bắt đầu hành trình nghề nghiệp
        </h1>
        <p className="text-lg opacity-90 max-w-md">
          Tạo tài khoản để ứng tuyển việc làm, theo dõi hồ sơ
          hoặc đăng tin tuyển dụng chỉ trong vài bước đơn giản.
        </p>

        <ul className="mt-8 space-y-3 text-sm opacity-90">
          <li>✔ Ứng tuyển nhanh chóng</li>
          <li>✔ Quản lý hồ sơ cá nhân</li>
          <li>✔ Tiếp cận nhà tuyển dụng uy tín</li>
        </ul>
      </div>

      {/* =====================
          RIGHT - FORM
      ===================== */}
      <div className="flex items-center justify-center bg-gray-100 px-4">
        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterPage;
