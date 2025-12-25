function UserInfo() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Thông tin cá nhân
      </h3>

      <div className="space-y-3 text-gray-700">
        <p><strong>Họ tên:</strong> Nguyễn Văn A</p>
        <p><strong>Email:</strong> example@gmail.com</p>
        <p><strong>Loại tài khoản:</strong> Ứng viên</p>
      </div>

      <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Cập nhật thông tin
      </button>
    </div>
  );
}

export default UserInfo;
