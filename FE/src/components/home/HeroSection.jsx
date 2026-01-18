import Searchbar from "../layout/Searchbar";
import {
  Briefcase,
  MapPin,
  Star,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{
        backgroundImage: "url('/images/hero-section.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* BACKGROUND LAYERS */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-black/90" />

        <div className="absolute -top-40 -left-40 w-[420px] h-[420px] bg-emerald-500/25 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[380px] h-[380px] bg-green-400/20 rounded-full blur-[120px]" />

        <div className="absolute inset-0 opacity-[0.04] bg-[url('/images/noise.jpg')]" />
      </div>

      {/* CONTENT */}
      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-28 text-center">
        {/* BADGE */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs backdrop-blur">
          <Sparkles size={13} className="text-emerald-400" />
          Nền tảng tìm kiếm việc làm hiện đại
        </div>

        {/* TITLE */}
        <h1 className="text-3xl md:text-5xl xl:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
          Cơ hội nghề nghiệp
          <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            {" "}
            dành riêng cho bạn
          </span>
        </h1>

        {/* DESCRIPTION */}
        <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
          Kết nối ứng viên với hàng nghìn cơ hội việc làm
          chất lượng từ các doanh nghiệp uy tín trên
          toàn quốc.
        </p>

        {/* SEARCH */}
        <div className="flex justify-center mb-10">
          <div className="w-full max-w-3xl">
            <Searchbar />
          </div>
        </div>

        {/* STATS */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-emerald-400" />
            Hàng nghìn việc làm
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-emerald-400" />
            Toàn quốc
          </div>
          <div className="flex items-center gap-2">
            <Star size={14} className="text-emerald-400" />
            Doanh nghiệp xác thực
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-emerald-400" />
            Cập nhật mỗi ngày
          </div>
        </div>
      </div>
    </section>
  );
}
