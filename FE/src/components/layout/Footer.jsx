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
  FaEnvelope
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-14 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">

        {/* ===== GIỚI THIỆU CÔNG TY ===== */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            JobFinder Việt Nam
          </h3>
          <p className="text-sm leading-relaxed">
            JobFinder là nền tảng kết nối ứng viên và nhà tuyển dụng,
            hỗ trợ tìm kiếm việc làm nhanh chóng và hiệu quả.
          </p>

          <div className="mt-4 text-sm space-y-1">
            <p>📍 180 Cao Lỗ, Quận 8, TP. Hồ Chí Minh</p>
            <p>📞 0123 456 789</p>
            <p>✉️ support@jobfinder.vn</p>
          </div>

          {/* SOCIAL ICONS */}
          <div className="flex gap-3 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 transition"
            >
              <FaFacebookF className="text-white text-sm" />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-700 transition"
            >
              <FaLinkedinIn className="text-white text-sm" />
            </a>
          </div>
        </div>

        {/* ===== DÀNH CHO ỨNG VIÊN ===== */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Dành cho ứng viên
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/jobs" className="flex items-center gap-2 hover:text-white">
                <FaBriefcase /> Tìm việc làm
              </Link>
            </li>
            <li>
              <Link to="/jobs?category=it" className="flex items-center gap-2 hover:text-white">
                <FaLaptopCode /> Việc làm IT
              </Link>
            </li>
            <li>
              <Link to="/jobs?type=intern" className="flex items-center gap-2 hover:text-white">
                <FaUserGraduate /> Việc làm thực tập
              </Link>
            </li>
            <li>
              <Link to="/profile" className="flex items-center gap-2 hover:text-white">
                <FaUser /> Hồ sơ của tôi
              </Link>
            </li>
          </ul>
        </div>

        {/* ===== NHÀ TUYỂN DỤNG ===== */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Nhà tuyển dụng
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/employer/post-job" className="flex items-center gap-2 hover:text-white">
                <FaBullhorn /> Đăng tin tuyển dụng
              </Link>
            </li>
            <li>
              <Link to="/employer/jobs" className="flex items-center gap-2 hover:text-white">
                <FaClipboardList /> Quản lý tin tuyển dụng
              </Link>
            </li>
            <li>
              <Link to="/employer/candidates" className="flex items-center gap-2 hover:text-white">
                <FaUsers /> Tìm kiếm ứng viên
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="flex items-center gap-2 hover:text-white">
                <FaMoneyBillWave /> Bảng giá dịch vụ
              </Link>
            </li>
          </ul>
        </div>

        {/* ===== HỖ TRỢ & PHÁP LÝ ===== */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Hỗ trợ & Pháp lý
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/support" className="flex items-center gap-2 hover:text-white">
                <FaHeadset /> Trung tâm hỗ trợ
              </Link>
            </li>
            <li>
              <Link to="/terms" className="flex items-center gap-2 hover:text-white">
                <FaFileContract /> Điều khoản sử dụng
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="flex items-center gap-2 hover:text-white">
                <FaShieldAlt /> Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link to="/contact" className="flex items-center gap-2 hover:text-white">
                <FaEnvelope /> Liên hệ
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* ===== COPYRIGHT ===== */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-500">
        © 2025 JobFinder Việt Nam. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
