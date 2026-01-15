import { Camera } from "lucide-react";

export default function UserAvatar() {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center shadow-sm hover:shadow-lg transition">
      {/* AVATAR */}
      <div className="relative w-fit mx-auto group">
        {/* glow */}
        <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 blur-xl opacity-40" />

        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 p-1">
          <img
            src="https://via.placeholder.com/160"
            alt="avatar"
            className="w-full h-full rounded-full object-cover bg-white"
          />

          {/* overlay */}
          <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/50 flex flex-col items-center justify-center text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition cursor-not-allowed">
            <Camera size={20} className="mb-1" />
            Đổi ảnh
          </div>
        </div>
      </div>

      {/* NAME */}
      <h3 className="mt-5 text-lg font-semibold text-gray-900 truncate">
        Tên người dùng
      </h3>

      {/* STATUS */}
      <p className="text-xs text-gray-500 mt-1">
        Hồ sơ cá nhân
      </p>

      {/* ACTION */}
      <button
        disabled
        className="mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition cursor-not-allowed"
      >
        <Camera size={16} />
        Thay đổi ảnh đại diện
      </button>
    </div>
  );
}
