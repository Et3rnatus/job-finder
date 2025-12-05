function KeyIndustries() {
  const industries = [
    { name: "Kinh Doanh", jobs: 1253, icon: "💼" },
    { name: "Kế Toán / Kiểm Toán", jobs: 912, icon: "📊" },
    { name: "Kiến Trúc / Xây Dựng", jobs: 911, icon: "🏗️" },
    { name: "CNTT / Viễn Thông", jobs: 817, icon: "💻" },
    { name: "Sản Xuất", jobs: 838, icon: "🏭" },
  ];

  return (
    <section className="max-w-[1200px] mx-auto px-4 mt-12">
      <h2
        className="text-2xl font-bold text-gray-800 mb-6"
        data-aos="fade-right"
      >
        Ngành Nghề Trọng Điểm
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {industries.map((item, index) => (
          <div
            key={index}
            className="bg-gray-200 border rounded-lg shadow-lg hover:shadow-green-100 p-4 text-center hover:border-green-600 hover:bg-white transition-all duration-300"
            data-aos="fade-up"
          >
            <div className="text-4xl mb-2">{item.icon}</div>
            <h4 className="text-lg font-bold text-gray-800">{item.name}</h4>
            <p className="text-gray-600 text-sm">
              {item.jobs.toLocaleString()} việc làm
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default KeyIndustries;
