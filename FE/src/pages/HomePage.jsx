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

  useEffect(() => {
    const role = localStorage.getItem("role");

 
    if (role !== "employer") return;


    const modalShown = sessionStorage.getItem("employerProfileModalShown");
    if (modalShown === "true") return;

    employerService.checkProfile().then((res) => {
      if (!res.completed) {
        setShowEmployerModal(true);
     
        sessionStorage.setItem("employerProfileModalShown", "true");
      }
    });
  }, []);

  return (
    <>
     
      <HeroSection />

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-14">
 
        <section>
          <JobList />
        </section>

  
        <section>
          <KeyIndustries />
        </section>

      
        <section>
          <TopCompanies />
        </section>
      </main>

  
      {showEmployerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Hồ sơ công ty chưa hoàn tất
            </h3>

            <p className="text-gray-600 mb-6">
              Vui lòng hoàn thiện hồ sơ công ty để sử dụng đầy đủ chức năng như đăng tin tuyển dụng.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEmployerModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
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

export default HomePage;
