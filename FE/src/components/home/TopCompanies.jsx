import { Sparkles, ArrowRight } from "lucide-react";

export default function TopCompanies() {
  const companies = [
    { name: "VPBank", logo: "/logos/vpbank.png" },
    { name: "Techcombank", logo: "/logos/techcombank.png" },
    { name: "MB Bank", logo: "/logos/mb.png" },
    { name: "VIB", logo: "/logos/vib.png" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 mt-36">
      {/* HEADER */}
      <div className="text-center mb-18">
        <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold mb-6">
          <Sparkles size={14} />
          Đối tác tuyển dụng
        </span>

        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Doanh nghiệp hàng đầu
        </h2>

        <p className="text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
          Đồng hành cùng hàng trăm doanh nghiệp lớn và uy tín
          trên toàn quốc
        </p>
      </div>

      {/* LOGO GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
        {companies.map((company, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-10 flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-transparent cursor-pointer"
          >
            {/* GRADIENT BACKGROUND */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition" />

            {/* LOGO */}
            <img
              src={company.logo}
              alt={company.name}
              className="relative z-10 h-14 object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition duration-300"
            />

            {/* NAME */}
            <span className="mt-4 text-xs font-semibold text-emerald-600 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition">
              {company.name}
            </span>

            {/* CTA */}
            <div className="absolute bottom-4 flex items-center gap-1 text-[11px] font-semibold text-gray-400 opacity-0 group-hover:opacity-100 transition">
              Xem tuyển dụng
              <ArrowRight size={12} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
