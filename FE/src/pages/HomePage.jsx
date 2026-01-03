import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import HeroSection from "../components/home/HeroSection";
import JobList from "../components/home/JobList";
import KeyIndustries from "../components/home/KeyIndustries";
import TopCompanies from "../components/home/TopCompanies";

import employerService from "../services/employerService";

function HomePage() {
  const [showEmployerModal, setShowEmployerModal] = useState(false);
  const navigate = useNavigate();

  /* =====================
     EMPLOYER PROFILE GUARD
  ===================== */
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "employer") return;

    // chỉ hiện 1 lần mỗi session
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
      {/* =====================
          HERO
      ===================== */}
      <HeroSection />

      {/* =====================
          MAIN CONTENT
      ===================== */}
      <main className="max-w-6xl mx-auto px-4 py-14 space-y-20">
        {/* JOB LIST */}
        <section>
          <SectionHeader
            title="Việc làm mới nhất"
            subtitle="Khám phá những cơ hội nghề nghiệp phù hợp với bạn"
          />
          <JobList />
        </section>

        {/* KEY INDUSTRIES */}
        <section>
          <SectionHeader
            title="Ngành nghề nổi bật"
            subtitle="Các lĩnh vực đang tuyển dụng nhiều nhất"
          />
          <KeyIndustries />
        </section>

        {/* TOP COMPANIES */}
        <section>
          <SectionHeader
            title="Nhà tuyển dụng hàng đầu"
            subtitle="Những doanh nghiệp được ứng viên quan tâm nhiều nhất"
          />
          <TopCompanies />
        </section>
      </main>

      {/* =====================
          EMPLOYER WARNING MODAL
      ===================== */}
      {showEmployerModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Hồ sơ công ty chưa hoàn tất
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Bạn cần hoàn thiện hồ sơ công ty để sử dụng đầy đủ
              chức năng như đăng tin tuyển dụng và quản lý ứng viên.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEmployerModal(false)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              >
                Để sau
              </button>

              <button
                onClick={() => {
                  setShowEmployerModal(false);
                  navigate("/account/employer");
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Hoàn thiện hồ sơ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =====================
   UI HELPERS
===================== */
const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-semibold text-gray-800">
      {title}
    </h2>
    {subtitle && (
      <p className="text-sm text-gray-500 mt-1">
        {subtitle}
      </p>
    )}
  </div>
);

export default HomePage;
