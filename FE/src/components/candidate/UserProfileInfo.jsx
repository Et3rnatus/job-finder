function UserProfileInfo() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* HEADER */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Hồ sơ cá nhân
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* LEFT COLUMN */}
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <p className="font-medium text-gray-800">Họ và tên</p>
            <p>Nguyễn Văn A</p>
          </div>

          <div>
            <p className="font-medium text-gray-800">Email</p>
            <p>nguyenvana@gmail.com</p>
          </div>

          <div>
            <p className="font-medium text-gray-800">Số điện thoại</p>
            <p>0123456789</p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <p className="font-medium text-gray-800">Kỹ năng</p>
            <p>ReactJS, NodeJS, MySQL</p>
          </div>

          <div>
            <p className="font-medium text-gray-800">Kinh nghiệm</p>
            <p>1 năm phát triển web</p>
          </div>

          <div>
            <p className="font-medium text-gray-800">Học vấn</p>
            <p>Công nghệ thông tin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileInfo;
