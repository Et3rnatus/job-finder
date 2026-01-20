import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
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
  const handleComingSoon = (e) => {
    e.preventDefault();
    toast("Chức năng đang được phát triển 🚧", {
      icon: "🚀",
      duration: 2500,
    });
  };

  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* =====================
          TOP CONTENT
      ===================== */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-14 pb-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* ===== BRAND ===== */}
        <div>
          <h3 className="text-white text-lg font-bold mb-3">
            JobFinder Việt Nam
          </h3>

          <p className="text-sm leading-relaxed">
            Nền tảng kết nối ứng viên và nhà tuyển dụng,
            giúp tìm kiếm việc làm nhanh chóng, minh bạch
            và hiệu quả.
          </p>

          {/* CONTACT */}
          <div className="mt-5 space-y-1.5 text-sm">
            <p>📍 180 Cao Lỗ, Quận 8, TP. Hồ Chí Minh</p>
            <p>📞 0123 456 789</p>
            <p>✉️ support@jobfinder.vn</p>
          </div>

          {/* SOCIAL */}
          <div className="flex gap-3 mt-5">
            <SocialIcon href="https://facebook.com">
              <FaFacebookF size={14} />
            </SocialIcon>
            <SocialIcon href="https://linkedin.com">
              <FaLinkedinIn size={14} />
            </SocialIcon>
          </div>
        </div>

        {/* ===== CANDIDATE ===== */}
        <FooterGroup title="Ứng viên">
          <FooterLink to="/jobs" icon={<FaBriefcase />} onClick={handleComingSoon}>
            Tìm việc làm
          </FooterLink>
          <FooterLink to="/jobs?category=it" icon={<FaLaptopCode />} onClick={handleComingSoon}>
            Việc làm IT
          </FooterLink>
          <FooterLink to="/jobs?type=intern" icon={<FaUserGraduate />} onClick={handleComingSoon}>
            Việc làm thực tập
          </FooterLink>
          <FooterLink to="/profile" icon={<FaUser />} onClick={handleComingSoon}>
            Hồ sơ cá nhân
          </FooterLink>
        </FooterGroup>

        {/* ===== EMPLOYER ===== */}
        <FooterGroup title="Nhà tuyển dụng">
          <FooterLink to="/employer/post-job" icon={<FaBullhorn />} onClick={handleComingSoon}>
            Đăng tin tuyển dụng
          </FooterLink>
          <FooterLink to="/employer/jobs" icon={<FaClipboardList />} onClick={handleComingSoon}>
            Quản lý tin tuyển dụng
          </FooterLink>
          <FooterLink to="/employer/candidates" icon={<FaUsers />} onClick={handleComingSoon}>
            Tìm kiếm ứng viên
          </FooterLink>
          <FooterLink to="/pricing" icon={<FaMoneyBillWave />} onClick={handleComingSoon}>
            Bảng giá dịch vụ
          </FooterLink>
        </FooterGroup>

        {/* ===== SUPPORT ===== */}
        <FooterGroup title="Hỗ trợ & pháp lý">
          <FooterLink to="/support" icon={<FaHeadset />} onClick={handleComingSoon}>
            Trung tâm hỗ trợ
          </FooterLink>
          <FooterLink to="/terms" icon={<FaFileContract />} onClick={handleComingSoon}>
            Điều khoản sử dụng
          </FooterLink>
          <FooterLink to="/privacy" icon={<FaShieldAlt />} onClick={handleComingSoon}>
            Chính sách bảo mật
          </FooterLink>
          <FooterLink to="/contact" icon={<FaEnvelope />} onClick={handleComingSoon}>
            Liên hệ
          </FooterLink>
        </FooterGroup>
      </div>

      {/* =====================
          BOTTOM BAR
      ===================== */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
          <span>
            © 2025 JobFinder Việt Nam. All rights reserved.
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
      <h4 className="text-white text-sm font-semibold mb-3">
        {title}
      </h4>
      <ul className="space-y-2 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ to, icon, children, onClick }) {
  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition"
      >
        <span className="text-xs opacity-80">{icon}</span>
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
        w-9 h-9
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
