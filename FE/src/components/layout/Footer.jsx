function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6" data-aos="fade-up">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Code địa chỉ*/}
        <div data-aos="fade-up" data-aos-delay="100">
          <h3 className="text-white text-lg font-semibold mb-4">Địa chỉ</h3>
          <p>JobFinder Việt Nam</p>
          <p>180 Cao Lỗ</p>
          <p>Phường 4, Quận 8, TP. Hồ Chí Minh</p>
        </div>

        {/* Code liên kết nhanh */}
        <div data-aos="fade-up" data-aos-delay="200">
          <h3 className="text-white text-lg font-semibold mb-4">
            Liên kết nhanh
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white">
                Liên hệ & Hỗ trợ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Việc làm
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Tìm kiếm phổ biến */}
        <div data-aos="fade-up" data-aos-delay="300">
          <h3 className="text-white text-lg font-semibold mb-4">
            Tìm kiếm phổ biến
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white">
                Lập trình viên React
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Thiết kế UX/UI
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Phân tích dữ liệu
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Thực tập sinh IT
              </a>
            </li>
          </ul>
        </div>

        {/* Form nhập Email đăng ký nhận tin */}
        <div data-aos="fade-up" data-aos-delay="400">
          <h3 className="text-white text-lg font-semibold mb-4">
            Đăng ký nhận tin
          </h3>
          <p className="mb-4">Nhận thông báo việc làm mới qua email</p>
          <form className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Địa chỉ email"
              className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Đăng ký
            </button>
          </form>
        </div>
      </div>

      {/* Thông tin bản quyền */}
      <div
        className="text-center text-sm text-gray-500"
        data-aos="fade-up"
        data-aos-delay="500"
      >
        © 2025. JobFinder Việt Nam.
      </div>
    </footer>
  );
}

export default Footer;
