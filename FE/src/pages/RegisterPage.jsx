import RegisterForm from "../components/auth/RegisterForm";
import { UserPlus, CheckCircle2 } from "lucide-react";

function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* =====================
          LEFT – BRANDING
      ===================== */}
      <div className="hidden md:flex flex-col justify-center px-12 bg-gradient-to-br from-green-700 to-green-600 text-white">
        <div className="max-w-md">
          {/* ICON */}
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
            <UserPlus size={28} />
          </div>

          {/* TITLE */}
          <h1 className="text-3xl font-bold mb-4 leading-snug">
            Bắt đầu hành trình nghề nghiệp
          </h1>

          {/* DESC */}
          <p className="text-lg opacity-90">
            Tạo tài khoản để ứng tuyển việc làm, theo dõi hồ sơ
            hoặc đăng tin tuyển dụng chỉ trong vài bước đơn giản.
          </p>

          {/* FEATURES */}
          <ul className="mt-10 space-y-4 text-sm opacity-95">
            <li className="flex items-center gap-3">
              <CheckCircle2 size={18} />
              Ứng tuyển nhanh chóng chỉ với 1 cú click
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 size={18} />
              Quản lý hồ sơ cá nhân & lịch sử ứng tuyển
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 size={18} />
              Kết nối với nhà tuyển dụng uy tín
            </li>
          </ul>
        </div>
      </div>

      {/* =====================
          RIGHT – REGISTER FORM
      ===================== */}
      <div className="flex items-center justify-center bg-gray-100 px-4">
        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterPage;
