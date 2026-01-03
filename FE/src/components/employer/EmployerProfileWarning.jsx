function EmployerProfileWarning({ onEditProfile }) {
  return (
    <div
      className="
        mb-6 flex items-start gap-4
        bg-yellow-50 border border-yellow-300
        rounded-xl p-5
      "
    >
      {/* ICON */}
      <div className="text-2xl">⚠️</div>

      {/* CONTENT */}
      <div className="flex-1">
        <h4 className="font-semibold text-yellow-800 mb-1">
          Hồ sơ công ty chưa hoàn thiện
        </h4>

        <p className="text-sm text-yellow-700">
          Vui lòng hoàn thiện hồ sơ doanh nghiệp để
          đăng tin tuyển dụng và sử dụng đầy đủ các
          chức năng của hệ thống.
        </p>
      </div>

      {/* ACTION */}
      {onEditProfile && (
        <button
          onClick={onEditProfile}
          className="
            px-4 py-2 text-sm font-medium
            bg-yellow-400 text-yellow-900
            rounded-full hover:bg-yellow-500
            transition whitespace-nowrap
          "
        >
          Hoàn thiện ngay
        </button>
      )}
    </div>
  );
}

export default EmployerProfileWarning;
