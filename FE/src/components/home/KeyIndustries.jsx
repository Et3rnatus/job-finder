function KeyIndustries() {
  const industries = [
    { name: "Kinh Doanh", jobs: 1253, icon: "💼" },
    { name: "Kế Toán / Kiểm Toán", jobs: 912, icon: "📊" },
    { name: "Kiến Trúc / Xây Dựng", jobs: 911, icon: "🏗️" },
    { name: "CNTT / Viễn Thông", jobs: 817, icon: "💻" },
    { name: "Sản Xuất", jobs: 838, icon: "🏭" },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 mt-20">
      {/* HEADER */}
      <div className="mb-8 text-center">
        <h2
          className="text-3xl font-bold text-gray-800"
          data-aos="fade-right"
        >
          Ngành nghề trọng điểm
        </h2>
        <p className="text-gray-500 mt-2">
          Khám phá các lĩnh vực đang có nhu cầu tuyển dụng cao
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {industries.map((item, index) => (
          <div
            key={index}
            data-aos="fade-up"
            className="
              group bg-white border rounded-xl p-6 text-center
              hover:border-green-500 hover:shadow-lg
              transition-all duration-300 cursor-pointer
            "
          >
            {/* ICON */}
            <div
              className="
                w-16 h-16 mx-auto mb-4
                flex items-center justify-center
                rounded-full bg-green-50 text-3xl
                group-hover:bg-green-100 transition
              "
            >
              {item.icon}
            </div>

            {/* NAME */}
            <h4 className="text-base font-semibold text-gray-800 mb-1">
              {item.name}
            </h4>

            {/* COUNT */}
            <p className="text-sm text-gray-500">
              {item.jobs.toLocaleString()} việc làm
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default KeyIndustries;
