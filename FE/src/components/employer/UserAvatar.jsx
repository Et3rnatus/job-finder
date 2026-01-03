function UserAvatar() {
  return (
    <div
      className="
        bg-white border rounded-xl p-6 text-center
        hover:shadow-md transition
      "
    >
      {/* AVATAR */}
      <div className="relative w-fit mx-auto">
        <img
          src="https://via.placeholder.com/120"
          alt="avatar"
          className="
            w-28 h-28 rounded-full object-cover
            border-4 border-green-500
          "
        />

        {/* HOVER OVERLAY (future upload) */}
        <div
          className="
            absolute inset-0 rounded-full
            bg-black/40 opacity-0
            flex items-center justify-center
            text-white text-sm font-medium
            hover:opacity-100 transition
            cursor-pointer
          "
        >
          Đổi ảnh
        </div>
      </div>

      {/* NAME */}
      <h3 className="mt-4 text-lg font-semibold text-gray-800 truncate">
        Tên người dùng
      </h3>

      {/* ACTION */}
      <button
        className="
          mt-3 text-sm font-medium
          text-green-600 hover:text-green-700
          hover:underline transition
        "
      >
        Thay đổi ảnh đại diện
      </button>
    </div>
  );
}

export default UserAvatar;
