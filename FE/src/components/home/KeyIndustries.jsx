import {
  Briefcase,
  BarChart3,
  Building2,
  Cpu,
  Factory,
  ArrowRight,
} from "lucide-react";

export default function KeyIndustries() {
  const industries = [
    {
      name: "Kinh doanh",
      jobs: 1253,
      icon: <Briefcase size={28} />,
      color: "from-emerald-400 to-emerald-600",
    },
    {
      name: "Kế toán / Kiểm toán",
      jobs: 912,
      icon: <BarChart3 size={28} />,
      color: "from-blue-400 to-blue-600",
    },
    {
      name: "Kiến trúc / Xây dựng",
      jobs: 911,
      icon: <Building2 size={28} />,
      color: "from-orange-400 to-orange-600",
    },
    {
      name: "CNTT / Viễn thông",
      jobs: 817,
      icon: <Cpu size={28} />,
      color: "from-violet-400 to-purple-600",
    },
    {
      name: "Sản xuất",
      jobs: 838,
      icon: <Factory size={28} />,
      color: "from-teal-400 to-teal-600",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 mt-28">
      {/* HEADER */}
      <div className="mb-16 text-center">
        <span className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
          Danh mục nổi bật
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Ngành nghề trọng điểm
        </h2>
        <p className="text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
          Khám phá những lĩnh vực đang có nhu cầu tuyển dụng
          cao và phát triển mạnh trên thị trường lao động
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {industries.map((item, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-transparent cursor-pointer"
          >
            {/* GRADIENT BACKDROP */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${item.color} transition`}
            />

            {/* ICON */}
            <div
              className={`relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
            >
              {item.icon}
            </div>

            {/* NAME */}
            <h4 className="relative z-10 text-base font-semibold text-gray-900 text-center mb-1">
              {item.name}
            </h4>

            {/* COUNT */}
            <p className="relative z-10 text-sm text-gray-500 text-center">
              {item.jobs.toLocaleString()} việc làm
            </p>

            {/* CTA */}
            <div className="absolute inset-x-0 bottom-5 flex justify-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                Xem việc làm
                <ArrowRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
