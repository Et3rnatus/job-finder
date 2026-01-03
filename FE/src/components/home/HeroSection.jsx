import Searchbar from "../layout/Searchbar";

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/40" />

      {/* CONTENT */}
      <div className="relative max-w-6xl mx-auto px-4 py-40 text-center">
        {/* HEADLINE */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Việc làm tốt nhất
          <br className="hidden md:block" />
          <span className="text-green-500"> dành cho bạn</span>
        </h1>

        {/* SUBTITLE */}
        <p className="text-gray-300 text-base md:text-lg mb-10">
          Hàng nghìn cơ hội việc làm chất lượng từ các doanh nghiệp uy tín
        </p>

        {/* SEARCH */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <Searchbar />
          </div>
        </div>

        {/* TRUST / HINT */}
        <div className="mt-8 text-sm text-gray-400">
          🔍 Tìm kiếm theo vị trí, kỹ năng
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
