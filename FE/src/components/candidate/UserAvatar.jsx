function UserAvatar({ fullName, isProfileCompleted }) {
  return (
    <div
      className="
        bg-white border border-gray-200 rounded-xl
        p-6 text-center
        hover:shadow-md transition
      "
    >
      {/* AVATAR */}
      <div className="relative w-fit mx-auto">
        <img
          src="https://via.placeholder.com/120"
          alt="avatar"
          className={`
            w-28 h-28 rounded-full object-cover
            border-4
            ${
              isProfileCompleted
                ? "border-green-500"
                : "border-red-400"
            }
          `}
        />

        {/* STATUS DOT */}
        <span
          className={`
            absolute bottom-1 right-1
            w-4 h-4 rounded-full border-2 border-white
            ${
              isProfileCompleted
                ? "bg-green-500"
                : "bg-red-400"
            }
          `}
        />
      </div>

      {/* NAME */}
      <h3 className="mt-4 text-lg font-semibold text-gray-800 truncate">
        {fullName || "Ứng viên"}
      </h3>

      {/* STATUS BADGE */}
      <div className="mt-2 flex justify-center">
        <span
          className={`
            px-3 py-1 text-xs font-medium rounded-full
            ${
              isProfileCompleted
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          `}
        >
          {isProfileCompleted
            ? "Hồ sơ đã hoàn thiện"
            : "Hồ sơ chưa hoàn thiện"}
        </span>
      </div>

      {/* NOTE */}
      <p className="mt-4 text-xs text-gray-400 leading-relaxed">
        Chức năng thay đổi ảnh đại diện
        <br />
        sẽ được phát triển sau
      </p>
    </div>
  );
}

export default UserAvatar;
