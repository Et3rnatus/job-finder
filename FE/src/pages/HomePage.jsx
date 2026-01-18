import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import {
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

import HeroSection from "../components/home/HeroSection";
import JobList from "../components/home/JobList";
import KeyIndustries from "../components/home/KeyIndustries";
import TopCompanies from "../components/home/TopCompanies";
import employerService from "../services/employerService";

/* ================= REVEAL ================= */
const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: "easeOut", delay }}
  >
    {children}
  </motion.div>
);

function HomePage() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [showEmployerModal, setShowEmployerModal] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(0);

  useEffect(() => {
    if (role !== "employer") return;

    const modalShown = sessionStorage.getItem("employerProfileModalShown");
    if (modalShown === "true") return;

    employerService.checkProfile().then((res) => {
      if (!res.completed) {
        setShowEmployerModal(true);
        sessionStorage.setItem("employerProfileModalShown", "true");
      }
    });
  }, [role]);

  const faqData = [
    {
      q: "Có cần tạo tài khoản?",
      a: "Có, để theo dõi hồ sơ, ứng tuyển và nhận gợi ý việc làm phù hợp.",
    },
    {
      q: "Ứng tuyển có mất phí?",
      a: "Hoàn toàn miễn phí đối với ứng viên.",
    },
    {
      q: "Doanh nghiệp có được xác thực không?",
      a: "Tất cả doanh nghiệp đều được kiểm duyệt trước khi đăng tin.",
    },
    {
      q: "Có giới hạn số lần ứng tuyển?",
      a: "Không. Bạn có thể ứng tuyển không giới hạn.",
    },
  ];

  return (
    <>
      <HeroSection />

      <main className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">

          {/* JOB LIST */}
          <Reveal>
            <section>
              <SectionHeader
                badge="Gợi ý hôm nay"
                title="Việc làm phù hợp với bạn"
                subtitle="Cơ hội tuyển dụng chất lượng, cập nhật mỗi ngày"
              />
              <div className="mt-8">
                <JobList />
              </div>
            </section>
          </Reveal>

          {/* SOCIAL PROOF */}
          <Reveal delay={0.1}>
            <section className="relative bg-white rounded-3xl border border-slate-200 p-10 overflow-hidden">
              <Glow />
              <SectionHeader
                badge="Độ tin cậy"
                title="Hàng nghìn ứng viên đã tìm được việc làm"
                subtitle="Nền tảng kết nối ứng viên và doanh nghiệp uy tín"
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 text-center">
                <StatCountUp value={10000} label="Ứng viên" suffix="+" />
                <StatCountUp value={3200} label="Việc làm" suffix="+" />
                <StatCountUp value={850} label="Doanh nghiệp" suffix="+" />
                <StatCountUp value={95} label="Hài lòng" suffix="%" />
              </div>
            </section>
          </Reveal>

          {/* WHY US */}
          <Reveal delay={0.15}>
            <section className="bg-white rounded-3xl border border-slate-200 p-10">
              <SectionHeader
                badge="Lợi ích nổi bật"
                title="Vì sao ứng viên lựa chọn nền tảng?"
                subtitle="Trải nghiệm tìm việc nhanh, gọn và minh bạch"
              />

              <div className="grid lg:grid-cols-2 gap-10 mt-8 items-center">
                <div className="grid md:grid-cols-3 gap-6">
                  <Feature
                    icon={<Briefcase size={22} />}
                    title="Việc làm chọn lọc"
                    desc="Tin tuyển dụng được kiểm duyệt rõ ràng."
                    onClick={() => navigate("/jobs")}
                  />
                  <Feature
                    icon={<CheckCircle2 size={22} />}
                    title="Ứng tuyển nhanh"
                    desc="Chỉ vài thao tác là xong."
                    onClick={() => navigate("/jobs")}
                  />
                  <Feature
                    icon={<Building2 size={22} />}
                    title="Doanh nghiệp uy tín"
                    desc="Công ty xác thực minh bạch."
                    onClick={() => navigate("/companies")}
                  />
                </div>

                <img
                  src="/images/why-us.jpeg"
                  alt="Why choose us"
                  className="hidden lg:block w-full max-w-sm mx-auto rounded-2xl shadow-lg"
                />
              </div>
            </section>
          </Reveal>

          {/* HOW IT WORKS */}
          <Reveal delay={0.2}>
            <section
              className="relative overflow-hidden rounded-3xl"
              style={{
                backgroundImage: "url('/images/how-it-work.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-900/70 to-slate-900/85" />

              <div className="relative px-10 py-14 md:px-14 md:py-20 text-white">
                <SectionHeader
                  badge="Quy trình"
                  title="Ứng tuyển chỉ với 3 bước đơn giản"
                  subtitle="Dành cho ứng viên mới bắt đầu"
                  light
                />

                <div className="grid md:grid-cols-3 gap-8 mt-12 text-center">
                  {[
                    ["1", "Tạo hồ sơ", "Cập nhật thông tin cá nhân và CV.", "/account/profile"],
                    ["2", "Tìm việc phù hợp", "Lọc theo ngành nghề và địa điểm.", "/jobs"],
                    ["3", "Ứng tuyển & theo dõi", "Theo dõi trạng thái hồ sơ.", "/account/applications"],
                  ].map(([n, t, d, link], i) => (
                    <motion.div
                      key={n}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 }}
                    >
                      <Step number={n} title={t} desc={d} onClick={() => navigate(link)} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </Reveal>

          {/* FAQ */}
          <Reveal delay={0.3}>
            <section
              className="relative overflow-hidden rounded-3xl"
              style={{
                backgroundImage: "url('/images/fqa.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/80" />

              <div className="relative z-10 p-8 md:p-12">
                <SectionHeader
                  title="Câu hỏi thường gặp"
                  subtitle="Giải đáp nhanh các thắc mắc phổ biến"
                  light
                />

                <div className="max-w-3xl mx-auto mt-8 space-y-4">
                  {faqData.map((item, i) => (
                    <FAQItem
                      key={i}
                      {...item}
                      isOpen={openFAQ === i}
                      onToggle={() => setOpenFAQ(openFAQ === i ? null : i)}
                    />
                  ))}
                </div>
              </div>
            </section>
          </Reveal>

          {/* CTA */}
          <Reveal delay={0.4}>
            <section
              className="relative overflow-hidden rounded-3xl text-white text-center"
              style={{
                backgroundImage: "url('/images/background.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-700/80 via-emerald-600/75 to-emerald-700/80" />
              <Glow dark />

              <div className="relative z-10 p-8 md:p-12">
                <h3 className="text-3xl md:text-4xl font-semibold mb-4">
                  {role === "employer"
                    ? "Bắt đầu đăng tin tuyển dụng"
                    : "Sẵn sàng cho bước tiến tiếp theo?"}
                </h3>

                <p className="text-white/90 mb-8 max-w-xl mx-auto">
                  {role === "employer"
                    ? "Tiếp cận nhanh nguồn ứng viên phù hợp chỉ trong vài phút."
                    : "Khám phá hàng nghìn cơ hội nghề nghiệp phù hợp với bạn."}
                </p>

                <button
                  onClick={() =>
                    navigate(role === "employer" ? "/jobs/create" : "/jobs")
                  }
                  className="inline-flex items-center gap-2 px-12 py-5 rounded-full bg-white text-emerald-700 font-semibold shadow-lg hover:shadow-xl transition"
                >
                  Khám phá ngay <ArrowRight size={18} />
                </button>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.45}>
            <TopCompanies />
          </Reveal>
        </div>
      </main>

      {/* EMPLOYER MODAL */}
      {showEmployerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md">
            <div className="flex gap-4">
              <div className="w-11 h-11 bg-yellow-100 text-yellow-700 rounded-xl flex items-center justify-center">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Hồ sơ doanh nghiệp chưa hoàn thiện
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Vui lòng cập nhật đầy đủ để đăng tin.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= COMPONENTS ================= */

const Glow = ({ dark }) => (
  <div
    className={`absolute -top-32 -right-32 w-[360px] h-[360px] rounded-full blur-3xl ${
      dark ? "bg-white/10" : "bg-emerald-200/40"
    }`}
  />
);

const SectionHeader = ({ badge, title, subtitle, light }) => (
  <div className="text-center max-w-2xl mx-auto">
    {badge && (
      <span
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
          light
            ? "bg-emerald-500/20 text-emerald-300"
            : "bg-emerald-100 text-emerald-700"
        }`}
      >
        <Sparkles size={13} />
        {badge}
      </span>
    )}
    <h2
      className={`text-3xl md:text-4xl font-semibold tracking-tight mt-4 ${
        light ? "text-white" : "text-gray-900"
      }`}
    >
      {title}
    </h2>
    {subtitle && (
      <p className={`mt-3 text-sm ${light ? "text-slate-300" : "text-slate-500"}`}>
        {subtitle}
      </p>
    )}
  </div>
);

const Feature = ({ icon, title, desc, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white border border-slate-200 rounded-2xl p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg hover:border-emerald-300"
  >
    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
      {icon}
    </div>
    <h4 className="font-medium text-sm text-gray-900">{title}</h4>
    <p className="text-xs text-slate-500 mt-1">{desc}</p>
  </button>
);

const Step = ({ number, title, desc, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white/95 backdrop-blur rounded-2xl p-8 text-gray-900 transition hover:shadow-xl hover:-translate-y-1"
  >
    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl font-bold">
      {number}
    </div>
    <h4 className="font-medium text-sm">{title}</h4>
    <p className="text-xs text-slate-500 mt-2">{desc}</p>
  </button>
);

const StatCountUp = ({ value, label, suffix = "" }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl font-bold text-emerald-600">
        {inView ? (
          <CountUp end={value} duration={2.5} separator="." suffix={suffix} />
        ) : (
          "0"
        )}
      </div>
      <div className="text-sm text-slate-500 mt-1">{label}</div>
    </div>
  );
};

const FAQItem = ({ q, a, isOpen, onToggle }) => (
  <div className="rounded-xl bg-white/95 backdrop-blur shadow-md overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition"
    >
      <h4 className="font-semibold text-sm text-gray-900">{q}</h4>
      <ChevronDown
        size={16}
        className={`transition ${
          isOpen ? "rotate-180 text-emerald-600" : "text-slate-400"
        }`}
      />
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
            {a}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default HomePage;
