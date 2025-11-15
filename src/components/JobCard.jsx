function JobCard({ title, salary, location, experience, skills }) {
  return (
    <div
      className="bg-gray-200 border rounded-lg shadow-lg hover:shadow-green-100 overflow-hidden hover:border-green-600 hover:bg-white transition duration-300"
      data-aos="fade-up"
    >
      <div className="p-4">
        <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full mb-2 bg-green-100 text-green-700">
          Tuyển dụng
        </span>
        <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
        <p className="text-gray-600 mb-1">💰 {salary}</p>
        <p className="text-gray-600 mb-1">📍 {location}</p>
        <p className="text-gray-600 mb-1">🧠 {experience} kinh nghiệm</p>
        <p className="text-gray-600 mb-3">🔧 Kỹ năng: {skills}</p>
        <button className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700">
          Ứng tuyển ngay
        </button>
      </div>
    </div>
  );
}

export default JobCard;
