import {
  CheckCircle2,
  AlertTriangle,
  Camera,
} from "lucide-react";

export default function UserAvatar({
  fullName,
  isProfileCompleted,
}) {
  return (
    <div className="relative bg-white border border-gray-200 rounded-3xl p-6 text-center shadow-sm hover:shadow-lg transition">
      {/* AVATAR */}
      <div className="relative w-fit mx-auto">
        {/* gradient ring */}
        <div
          className={`absolute -inset-1 rounded-full blur-xl opacity-50 ${
            isProfileCompleted
              ? "bg-gradient-to-br from-green-400 to-emerald-500"
              : "bg-gradient-to-br from-red-400 to-orange-400"
          }`}
        />

        <div className="relative">
          <img
            src="https://via.placeholder.com/160"
            alt="avatar"
            className={`w-32 h-32 rounded-full object-cover border-4 bg-white ${
              isProfileCompleted
                ? "border-emerald-500"
                : "border-red-400"
            }`}
          />

          {/* status dot */}
          <span
            className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${
              isProfileCompleted
                ? "bg-emerald-500"
                : "bg-red-400"
            }`}
          />

          {/* overlay */}
          <div className="absolute inset-0 rounded-full bg-black/0 hover:bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition cursor-not-allowed">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* NAME */}
      <h3 className="mt-5 text-lg font-semibold text-gray-900 truncate">
        {fullName || "Ứng viên"}
      </h3>

      {/* STATUS */}
      <div className="mt-2 flex justify-center">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${
            isProfileCompleted
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {isProfileCompleted ? (
            <CheckCircle2 size={14} />
          ) : (
            <AlertTriangle size={14} />
          )}
          {isProfileCompleted
            ? "Hồ sơ đã hoàn thiện"
            : "Hồ sơ chưa hoàn thiện"}
        </span>
      </div>

      {/* CTA */}
      {!isProfileCompleted && (
        <button className="mt-4 px-5 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white hover:opacity-90 transition">
          Hoàn thiện hồ sơ
        </button>
      )}

      {/* NOTE */}
      <p className="mt-4 text-xs text-gray-400 leading-relaxed">
        Tính năng thay đổi ảnh đại diện
        <br />
        sẽ được cập nhật trong thời gian tới
      </p>
    </div>
  );
}
