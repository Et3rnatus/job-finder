function JobCard({ title, salary, location, experience, skills }) {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300"
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
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Ứng tuyển ngay
        </button>
      </div>
    </div>
  );
}

export default JobCard;
