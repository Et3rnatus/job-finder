function UserAvatar() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <img
        src="https://via.placeholder.com/120"
        alt="avatar"
        className="w-28 h-28 rounded-full mx-auto mb-4"
      />
      <h3 className="text-lg font-semibold text-gray-800">Tên người dùng</h3>

      <button className="mt-3 text-sm text-blue-600 hover:underline">
        Thay đổi ảnh đại diện
      </button>
    </div>
  );
}

export default UserAvatar;
