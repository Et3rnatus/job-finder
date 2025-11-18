function ApplyForm() {
  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Ứng tuyển vị trí: Nhân Viên Giao Nhận Phương Tiện (Ca Đêm)
      </h2>

      {/* Chọn CV */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chọn CV để ứng tuyển
        </label>
        <select className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="cv-online">CV Online</option>
          <option value="cv-upload">Tải lên từ máy</option>
        </select>
        <p className="text-sm text-gray-500 mt-1">Dung lượng tối đa 5MB</p>
      </div>

      {/* Thư giới thiệu */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thư giới thiệu
        </label>
        <textarea
          rows="5"
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Giới thiệu ngắn gọn bản thân và lý do bạn muốn ứng tuyển vào vị trí này."
        ></textarea>
        <p className="text-sm text-gray-500 mt-1">
          Viết gì đó để nhà tuyển dụng hiểu thêm về bạn nhé!
        </p>
      </div>

      {/* Nút nộp hồ sơ */}
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition"
      >
        Nộp hồ sơ ứng tuyển
      </button>
    </div>
  );
}

export default ApplyForm;
