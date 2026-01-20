import {
  Briefcase,
  BarChart3,
  Building2,
  Cpu,
  Factory,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function KeyIndustries() {
  const industries = [
    {
      name: "Kinh doanh",
      jobs: 1253,
      icon: <Briefcase size={22} />,
      color: "from-emerald-400 to-emerald-600",
    },
    {
      name: "Kế toán / Kiểm toán",
      jobs: 912,
      icon: <BarChart3 size={22} />,
      color: "from-blue-400 to-blue-600",
    },
    {
      name: "Kiến trúc / Xây dựng",
      jobs: 911,
      icon: <Building2 size={22} />,
      color: "from-orange-400 to-orange-600",
    },
    {
      name: "CNTT / Viễn thông",
      jobs: 817,
      icon: <Cpu size={22} />,
      color: "from-violet-400 to-purple-600",
    },
    {
      name: "Sản xuất",
      jobs: 838,
      icon: <Factory size={22} />,
      color: "from-teal-400 to-teal-600",
    },
  ];

  const handleClick = () => {
    toast("Chức năng đang phát triển 🚧", {
      icon: "🚀",
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mt-20">
      {/* HEADER */}
      <div className="mb-10 text-center">
        <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
          Danh mục nổi bật
        </span>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Ngành nghề trọng điểm
        </h2>

        <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
          Những lĩnh vực đang có nhu cầu tuyển dụng cao
          trên thị trường lao động
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {industries.map((item, index) => (
          <button
            key={index}
            onClick={handleClick}
            type="button"
            className="
              group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5
              transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-transparent
              text-left
            "
          >
            {/* GRADIENT BACKGROUND */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition`}
            />

            {/* ICON */}
            <div
              className={`relative z-10 mx-auto mb-4 flex h-12 w-12 items-center justify-center
                          rounded-xl bg-gradient-to-br ${item.color} text-white shadow`}
            >
              {item.icon}
            </div>

            {/* NAME */}
            <h4 className="relative z-10 text-sm font-semibold text-gray-900 text-center mb-0.5">
              {item.name}
            </h4>

            {/* COUNT */}
            <p className="relative z-10 text-xs text-gray-500 text-center">
              {item.jobs.toLocaleString()} việc làm
            </p>

            {/* CTA */}
            <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                Xem việc làm
                <ArrowRight size={12} />
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
