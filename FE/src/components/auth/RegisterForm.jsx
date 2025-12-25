import { Link } from "react-router-dom";
function RegisterForm() {
  return (
    <div className="max-w-4xl mx-auto mt-20 my-40 bg-white p-10 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Tạo tài khoản mới
      </h2>

      <form className="space-y-6">
        {/* Họ + Tên */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Nhập họ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Nhập tên"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Nhập email của bạn"
          />
        </div>

        {/* Mật khẩu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Tạo mật khẩu"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loại tài khoản
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="candidate">Ứng viên</option>
            <option value="employer">Nhà tuyển dụng</option>
          </select>
        </div>


        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition font-semibold"
        >
          Đăng ký
        </button>

        {/* Bạn đã có tài khoản? */}
        <div className="text-center text-sm mt-4 ">
          <span className="text-gray-700">Bạn đã có tài khoản? </span>
          <Link to="/login" className="text-blue-600 font-bold hover:underline cursor-pointer">
            Đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
