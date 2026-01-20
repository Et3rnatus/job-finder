import { Sparkles, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";

export default function TopCompanies() {
  const companies = [
    { name: "Viettel Group", logo: "/images/viettel.jpg" },
    { name: "FPT Corporation", logo: "/images/fpt.png" },
    { name: "Vingroup", logo: "/images/vingroup.png" },
    { name: "MB Bank", logo: "/images/mb.jpg" },
  ];

  const handleComingSoon = () => {
    toast("Chức năng đang được phát triển 🚧", {
      icon: "🚀",
      duration: 2500,
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mt-20">
      {/* ================= HEADER ================= */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold mb-4">
          <Sparkles size={13} />
          Đối tác tuyển dụng
        </span>

        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
          Doanh nghiệp hàng đầu
        </h2>

        <p className="text-slate-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
          Đồng hành cùng các doanh nghiệp lớn và uy tín
          trên toàn quốc
        </p>
      </div>

      {/* ================= LOGO GRID ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {companies.map((company, index) => (
          <div
            key={index}
            onClick={handleComingSoon}
            className="
              group relative
              rounded-2xl border border-slate-200 bg-white
              p-6 flex flex-col items-center justify-center
              transition-all duration-200 ease-out
              hover:-translate-y-1 hover:shadow-md hover:border-emerald-200
              cursor-pointer
            "
          >
            {/* SOFT HOVER BACKGROUND */}
            <div className="absolute inset-0 rounded-2xl bg-emerald-50 opacity-0 group-hover:opacity-100 transition" />

            {/* LOGO */}
            <img
              src={company.logo}
              alt={company.name}
              className="
                relative z-10
                h-10 object-contain
                grayscale opacity-60
                group-hover:grayscale-0 group-hover:opacity-100
                transition duration-200
              "
            />

            {/* NAME */}
            <span
              className="
                mt-3 text-[11px] font-semibold text-emerald-700
                opacity-0 translate-y-1
                group-hover:opacity-100 group-hover:translate-y-0
                transition duration-200
              "
            >
              {company.name}
            </span>

            {/* CTA */}
            <div
              className="
                absolute bottom-3
                flex items-center gap-1
                text-[10px] font-semibold text-slate-400
                opacity-0 group-hover:opacity-100
                transition duration-200
              "
            >
              Xem tuyển dụng
              <ArrowRight size={11} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
