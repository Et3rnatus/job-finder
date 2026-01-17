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
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* BACKGROUND EFFECT */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-emerald-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[460px] h-[460px] bg-green-400/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* CONTENT */}
      <div className="relative max-w-7xl mx-auto px-6 py-40 text-center">
        {/* BADGE */}
        <div className="inline-flex items-center gap-2 mb-10 px-5 py-2 rounded-full bg-white/10 border border-white/10 text-sm backdrop-blur">
          <Sparkles size={14} className="text-emerald-400" />
          Nền tảng tìm kiếm việc làm hiện đại
        </div>

        {/* TITLE */}
        <h1 className="text-4xl md:text-6xl xl:text-7xl font-extrabold leading-tight mb-8 tracking-tight">
          Cơ hội nghề nghiệp
          <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            {" "}
            dành riêng cho bạn
          </span>
        </h1>

        {/* DESCRIPTION */}
        <p className="text-gray-300 text-base md:text-lg max-w-3xl mx-auto mb-16 leading-relaxed">
          Kết nối ứng viên với hàng nghìn cơ hội việc làm
          chất lượng từ các doanh nghiệp uy tín trên
          toàn quốc. Tìm việc nhanh – đúng – hiệu quả.
        </p>

        {/* SEARCH BAR */}
        <div className="flex justify-center mb-16">
          <div className="w-full max-w-4xl">
            <Searchbar />
          </div>
        </div>

        {/* TRUST / STATS */}
        <div className="flex flex-wrap justify-center gap-10 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Briefcase size={16} className="text-emerald-400" />
            Hàng nghìn việc làm
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-emerald-400" />
            Toàn quốc
          </div>
          <div className="flex items-center gap-2">
            <Star size={16} className="text-emerald-400" />
            Doanh nghiệp xác thực
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-400" />
            Cập nhật mỗi ngày
          </div>
        </div>
      </div>
    </section>
  );
}
