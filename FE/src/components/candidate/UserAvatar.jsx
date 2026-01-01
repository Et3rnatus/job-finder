function UserAvatar({ fullName, isProfileCompleted }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
      {/* AVATAR */}
      <img
        src="https://via.placeholder.com/120"
        alt="avatar"
        className="w-28 h-28 rounded-full mx-auto mb-4 border"
      />

      {/* USER NAME */}
      <h3 className="text-lg font-semibold text-gray-800">
        {fullName || "Ứng viên"}
      </h3>

      {/* PROFILE STATUS */}
      <p
        className={`text-sm mt-1 ${
          isProfileCompleted ? "text-green-600" : "text-red-600"
        }`}
      >
        {isProfileCompleted
          ? "Hồ sơ đã hoàn thiện"
          : "Hồ sơ chưa hoàn thiện"}
      </p>

      {/* ACTION (DISABLED – GIẢI THÍCH RÕ) */}
      <p className="mt-3 text-xs text-gray-400">
        (Chức năng thay đổi ảnh đại diện sẽ được phát triển sau)
      </p>
    </div>
  );
}

export default UserAvatar;
