function UserAvatar() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">

      <img
        src="https://via.placeholder.com/120"
        alt="avatar"
        className="w-28 h-28 rounded-full mx-auto mb-4 border"
      />

      <h3 className="text-lg font-semibold text-gray-800">
        Tên người dùng
      </h3>


      <button className="mt-3 text-sm text-green-600 hover:underline">
        Thay đổi ảnh đại diện
      </button>
    </div>
  );
}

export default UserAvatar;
