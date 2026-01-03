function TopCompanies() {
  const companies = [
    { name: "VPBank", logo: "/logos/vpbank.png" },
    { name: "Techcombank", logo: "/logos/techcombank.png" },
    { name: "MB Bank", logo: "/logos/mb.png" },
    { name: "VIB", logo: "/logos/vib.png" },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 mt-24">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h2
          className="text-3xl font-bold text-gray-800"
          data-aos="fade-left"
        >
          Doanh nghiệp hàng đầu
        </h2>
        <p className="text-gray-500 mt-2">
          Được tin tưởng bởi các thương hiệu uy tín
        </p>
      </div>

      {/* LOGO GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">
        {companies.map((company, index) => (
          <div
            key={index}
            data-aos="fade-up"
            className="
              group bg-white border rounded-xl
              p-6 flex justify-center items-center
              hover:shadow-lg hover:border-green-500
              transition-all duration-300
            "
          >
            <img
              src={company.logo}
              alt={company.name}
              className="
                h-12 object-contain
                grayscale opacity-80
                group-hover:grayscale-0 group-hover:opacity-100
                transition
              "
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default TopCompanies;
