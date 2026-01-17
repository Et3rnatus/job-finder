import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaBriefcase,
  FaLaptopCode,
  FaUserGraduate,
  FaUser,
  FaBullhorn,
  FaClipboardList,
  FaUsers,
  FaMoneyBillWave,
  FaHeadset,
  FaFileContract,
  FaShieldAlt,
  FaEnvelope,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* =====================
          TOP CONTENT
      ===================== */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* ===== BRAND ===== */}
        <div>
          <h3 className="text-white text-xl font-bold mb-4">
            JobFinder Việt Nam
          </h3>

          <p className="text-sm leading-relaxed">
            Nền tảng kết nối ứng viên và nhà tuyển dụng,
            giúp tìm kiếm việc làm nhanh chóng, minh bạch
            và hiệu quả.
          </p>

          {/* CONTACT */}
          <div className="mt-6 space-y-2 text-sm">
            <p>📍 180 Cao Lỗ, Quận 8, TP. Hồ Chí Minh</p>
            <p>📞 0123 456 789</p>
            <p>✉️ support@jobfinder.vn</p>
          </div>

          {/* SOCIAL */}
          <div className="flex gap-3 mt-6">
            <SocialIcon href="https://facebook.com">
              <FaFacebookF />
            </SocialIcon>
            <SocialIcon href="https://linkedin.com">
              <FaLinkedinIn />
            </SocialIcon>
          </div>
        </div>

        {/* ===== CANDIDATE ===== */}
        <FooterGroup title="Ứng viên">
          <FooterLink to="/jobs" icon={<FaBriefcase />}>
            Tìm việc làm
          </FooterLink>
          <FooterLink to="/jobs?category=it" icon={<FaLaptopCode />}>
            Việc làm IT
          </FooterLink>
          <FooterLink to="/jobs?type=intern" icon={<FaUserGraduate />}>
            Việc làm thực tập
          </FooterLink>
          <FooterLink to="/profile" icon={<FaUser />}>
            Hồ sơ cá nhân
          </FooterLink>
        </FooterGroup>

        {/* ===== EMPLOYER ===== */}
        <FooterGroup title="Nhà tuyển dụng">
          <FooterLink to="/employer/post-job" icon={<FaBullhorn />}>
            Đăng tin tuyển dụng
          </FooterLink>
          <FooterLink to="/employer/jobs" icon={<FaClipboardList />}>
            Quản lý tin tuyển dụng
          </FooterLink>
          <FooterLink to="/employer/candidates" icon={<FaUsers />}>
            Tìm kiếm ứng viên
          </FooterLink>
          <FooterLink to="/pricing" icon={<FaMoneyBillWave />}>
            Bảng giá dịch vụ
          </FooterLink>
        </FooterGroup>

        {/* ===== SUPPORT ===== */}
        <FooterGroup title="Hỗ trợ & pháp lý">
          <FooterLink to="/support" icon={<FaHeadset />}>
            Trung tâm hỗ trợ
          </FooterLink>
          <FooterLink to="/terms" icon={<FaFileContract />}>
            Điều khoản sử dụng
          </FooterLink>
          <FooterLink to="/privacy" icon={<FaShieldAlt />}>
            Chính sách bảo mật
          </FooterLink>
          <FooterLink to="/contact" icon={<FaEnvelope />}>
            Liên hệ
          </FooterLink>
        </FooterGroup>
      </div>

      {/* =====================
          BOTTOM BAR
      ===================== */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          <span>
            © 2026 JobFinder Việt Nam. All rights reserved.
          </span>

          <span className="text-xs text-gray-500">
            Made with ❤️ for graduation thesis
          </span>
        </div>
      </div>
    </footer>
  );
}

/* =====================
   SUB COMPONENTS
===================== */

function FooterGroup({ title, children }) {
  return (
    <div>
      <h4 className="text-white text-lg font-semibold mb-4">
        {title}
      </h4>
      <ul className="space-y-3 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ to, icon, children }) {
  return (
    <li>
      <Link
        to={to}
        className="
          flex items-center gap-2
          text-gray-400
          hover:text-white
          transition
        "
      >
        <span className="text-sm opacity-80">
          {icon}
        </span>
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        w-10 h-10
        flex items-center justify-center
        rounded-full
        bg-gray-800
        text-white
        hover:bg-emerald-600
        transition
      "
    >
      {children}
    </a>
  );
}

export default Footer;
