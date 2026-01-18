import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
} from "lucide-react";

import HeroSection from "../components/home/HeroSection";
import JobList from "../components/home/JobList";
import KeyIndustries from "../components/home/KeyIndustries";
import TopCompanies from "../components/home/TopCompanies";

import employerService from "../services/employerService";

function HomePage() {
  const [showEmployerModal, setShowEmployerModal] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

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

  return (
    <>
      {/* ================= HERO ================= */}
      <HeroSection />

      {/* ============ MAIN ============ */}
      <main
        className="relative"
        style={{
          backgroundImage: "url('/images/background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/60 via-slate-50/65 to-slate-50/70" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 space-y-20">
          {/* JOB LIST */}
          <section>
            <SectionHeader
              badge="Gợi ý hôm nay"
              title="Việc làm mới nhất"
              subtitle="Những cơ hội nghề nghiệp phù hợp với bạn được cập nhật liên tục"
            />
            <JobList />
          </section>

          {/* WHY US */}
          <section className="bg-white/90 rounded-2xl p-10 md:p-12 shadow-sm">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <SectionHeader
                  badge="Lợi ích nổi bật"
                  title="Tại sao ứng viên chọn nền tảng này?"
                />

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <Feature
                    icon={<Briefcase size={20} />}
                    title="Việc làm chất lượng"
                    desc="Tin tuyển dụng được kiểm duyệt, đến từ doanh nghiệp uy tín."
                    onClick={() => navigate("/jobs")}
                  />
                  <Feature
                    icon={<CheckCircle2 size={20} />}
                    title="Ứng tuyển nhanh"
                    desc="Chỉ vài cú click để gửi hồ sơ."
                    onClick={() => navigate("/jobs")}
                  />
                  <Feature
                    icon={<Building2 size={20} />}
                    title="Doanh nghiệp lớn"
                    desc="Hàng ngàn công ty đang tuyển dụng."
                    onClick={() => navigate("/companies")}
                  />
                </div>
              </div>

              <img
                src="/images/why-us.jpeg"
                alt="Why choose us"
                className="hidden lg:block w-full max-w-sm mx-auto rounded-xl shadow-md"
              />
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="relative overflow-hidden rounded-2xl">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url('/images/how-it-work.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50/60 to-slate-50/70" />

            <div className="relative p-10 md:p-12">
              <SectionHeader
                badge="Hướng dẫn"
                title="Ứng tuyển chỉ với 3 bước"
                subtitle="Dành cho ứng viên mới bắt đầu"
              />

              <div className="grid md:grid-cols-3 gap-8 mt-12 text-center">
                <Step
                  number="1"
                  title="Tạo hồ sơ"
                  desc="Hoàn thiện thông tin cá nhân."
                  onClick={() => navigate("/account/profile")}
                />
                <Step
                  number="2"
                  title="Tìm việc"
                  desc="Lọc theo ngành & địa điểm."
                  onClick={() => navigate("/jobs")}
                />
                <Step
                  number="3"
                  title="Ứng tuyển"
                  desc="Theo dõi trạng thái dễ dàng."
                  onClick={() => navigate("/account/applications")}
                />
              </div>
            </div>
          </section>

          {/* INDUSTRIES */}
          <KeyIndustries />

          {/* CTA */}
          <section className="rounded-2xl bg-gradient-to-br from-emerald-600 to-green-600 p-12 text-white text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {role === "employer"
                ? "Đăng tin tuyển dụng ngay hôm nay"
                : "Sẵn sàng tìm công việc phù hợp?"}
            </h3>
            <p className="text-white/80 mb-6 text-sm md:text-base">
              {role === "employer"
                ? "Tiếp cận hàng ngàn ứng viên chất lượng."
                : "Khám phá hàng ngàn cơ hội nghề nghiệp."}
            </p>

            <button
              onClick={() =>
                navigate(role === "employer" ? "/jobs/create" : "/jobs")
              }
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-emerald-700 font-semibold hover:bg-emerald-50 transition"
            >
              Bắt đầu ngay <ArrowRight size={16} />
            </button>
          </section>

          {/* COMPANIES */}
          <TopCompanies />
        </div>
      </main>

      {/* EMPLOYER MODAL */}
      {showEmployerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Hồ sơ công ty chưa hoàn thiện
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Hoàn thiện hồ sơ để đăng tin tuyển dụng hiệu quả hơn.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= SMALL COMPONENTS ================= */

const SectionHeader = ({ badge, title, subtitle }) => (
  <div className="mb-10 text-center">
    {badge && (
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
        <Sparkles size={13} />
        {badge}
      </div>
    )}
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
      {title}
    </h2>
    {subtitle && (
      <p className="text-gray-600 mt-2 max-w-xl mx-auto text-sm">
        {subtitle}
      </p>
    )}
  </div>
);

const Feature = ({ icon, title, desc, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white border border-emerald-100 rounded-xl p-5 hover:bg-emerald-50 transition"
  >
    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
      {icon}
    </div>
    <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
    <p className="text-xs text-gray-600 mt-1">{desc}</p>
  </button>
);

const Step = ({ number, title, desc, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white border border-emerald-100 rounded-xl p-6 hover:shadow-md transition"
  >
    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-600 text-white flex items-center justify-center text-lg font-bold">
      {number}
    </div>
    <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
    <p className="text-xs text-gray-600 mt-1">{desc}</p>
  </button>
);

export default HomePage;
