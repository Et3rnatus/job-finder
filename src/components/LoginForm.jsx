function LoginForm() {
  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Chào mừng bạn quay trở lại
      </h2>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Nhập email của bạn"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Nhập mật khẩu"
          />
        </div>

        <div className="text-right text-sm text-blue-600 hover:underline cursor-pointer">
          Quên mật khẩu?
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
