function TopCompanies() {
  const companies = [
    { name: "VPBank", logo: "/logos/vpbank.png" },
    { name: "Techcombank", logo: "/logos/techcombank.png" },
    { name: "MB Bank", logo: "/logos/mb.png" },
    { name: "VIB", logo: "/logos/vib.png" },
  ];

  return (
    <section className="max-w-[1200px] mx-auto px-4 mt-16">
      <h2
        className="text-2xl font-bold text-gray-800 mb-6"
        data-aos="fade-left"
      >
        Các Công Ty Hàng Đầu
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">
        {companies.map((company, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-4 flex justify-center items-center hover:shadow-md transition"
            data-aos="fade-down"
          >
            <img
              src={company.logo}
              alt={company.name}
              className="h-12 object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default TopCompanies;
