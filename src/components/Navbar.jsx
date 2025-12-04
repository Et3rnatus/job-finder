
function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">JobFinder</div>

        {/* Menu */}
        <div className="hidden md:flex gap-6 text-gray-700 font-medium">
          <a href="/" className="hover:text-blue-600">
            Trang chủ
          </a>
          <a href="/jobs" className="hover:text-blue-600">
            Việc làm
          </a>
          <a href="/employers" className="hover:text-blue-600">
            Tuyển dụng
          </a>
          <a href="/contact" className="hover:text-blue-600">
            Liên hệ
          </a>
          <a href="/docs" className="hover:text-blue-600">
            Tài liệu
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="border border-green-600 rounded-full px-4 py-2 text-green-600 hover:bg-green-100 font-semibold">
            Đăng ký
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 font-semibold">
            Đăng nhập
          </button>
          <button className="bg-gray-100 text-black px-4 py-2 rounded-full hover:bg-gray-200 font-semibold">
            Đăng tuyển & tìm hồ sơ
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
