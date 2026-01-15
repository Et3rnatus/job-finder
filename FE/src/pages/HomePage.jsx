import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, AlertTriangle, ArrowRight } from "lucide-react";

import HeroSection from "../components/home/HeroSection";
import JobList from "../components/home/JobList";
import KeyIndustries from "../components/home/KeyIndustries";
import TopCompanies from "../components/home/TopCompanies";

import employerService from "../services/employerService";

function HomePage() {
  const [showEmployerModal, setShowEmployerModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "employer") return;

    const modalShown = sessionStorage.getItem(
      "employerProfileModalShown"
    );
    if (modalShown === "true") return;

    employerService.checkProfile().then((res) => {
      if (!res.completed) {
        setShowEmployerModal(true);
        sessionStorage.setItem(
          "employerProfileModalShown",
          "true"
        );
      }
    });
  }, []);

  return (
    <>
      {/* HERO */}
      <HeroSection />

      {/* CONTENT */}
      <main className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-20 space-y-28">
          {/* JOB LIST */}
          <section>
            <SectionHeader
              badge="Gợi ý hôm nay"
              title="Việc làm mới nhất"
              subtitle="Cập nhật liên tục những cơ hội nghề nghiệp phù hợp"
            />
            <JobList />
          </section>

          {/* INDUSTRIES */}
          <section>
            <SectionHeader
              badge="Xu hướng"
              title="Ngành nghề nổi bật"
              subtitle="Những lĩnh vực đang tuyển dụng mạnh nhất hiện nay"
            />
            <KeyIndustries />
          </section>

          {/* COMPANIES */}
          <section>
            <SectionHeader
              badge="Đối tác"
              title="Nhà tuyển dụng hàng đầu"
              subtitle="Doanh nghiệp uy tín được ứng viên tin tưởng"
            />
            <TopCompanies />
          </section>
        </div>
      </main>

      {/* EMPLOYER WARNING MODAL */}
      {showEmployerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Hồ sơ công ty chưa hoàn thiện
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Hoàn thiện hồ sơ để đăng tin tuyển dụng và quản lý
                  ứng viên hiệu quả hơn.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEmployerModal(false)}
                className="px-5 py-2 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
              >
                Để sau
              </button>

              <button
                onClick={() => {
                  setShowEmployerModal(false);
                  navigate("/account/employer");
                }}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition"
              >
                Hoàn thiện ngay
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* UI */
const SectionHeader = ({ badge, title, subtitle }) => (
  <div className="mb-10 text-center">
    {badge && (
      <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-green-50 text-green-700 text-sm font-medium">
        <Sparkles size={14} />
        {badge}
      </div>
    )}
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
      {title}
    </h2>
    {subtitle && (
      <p className="text-gray-500 mt-3 max-w-xl mx-auto">
        {subtitle}
      </p>
    )}
  </div>
);

export default HomePage;
