import { ArrowRight, UserPlus, Building2 } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden mt-36">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      {/* CONTENT */}
      <div className="relative max-w-7xl mx-auto px-6 py-24 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
          Sẵn sàng tìm công việc phù hợp cho bạn?
        </h2>

        <p className="text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed">
          Tham gia nền tảng tuyển dụng hiện đại, kết nối
          ứng viên và doanh nghiệp nhanh chóng, minh bạch
          và hiệu quả.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-emerald-600 font-semibold hover:bg-gray-100 transition">
            <UserPlus size={18} />
            Dành cho ứng viên
            <ArrowRight size={16} />
          </button>

          <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition">
            <Building2 size={18} />
            Dành cho nhà tuyển dụng
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
