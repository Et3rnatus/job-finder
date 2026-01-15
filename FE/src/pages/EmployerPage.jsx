import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import UserAvatar from "../components/employer/UserAvatar";
import EmployerSideBarTool from "../components/employer/EmployerSideBarTool";
import EmployerProfileForm from "../components/employer/EmployerProfileForm";
import EmployerProfileView from "../components/employer/EmployerProfileView";
import EmployerJobList from "../components/employer/EmployerJobList";
import CreateJobForm from "../components/employer/CreateJobForm";
import EmployerPayment from "../components/employer/EmployerPayment";

import employerService from "../services/employerService";
import { AlertTriangle } from "lucide-react";

function EmployerPage() {
  const location = useLocation();

  const [mode, setMode] = useState("profile");
  const [profileMode, setProfileMode] = useState("view");

  const [profileCompleted, setProfileCompleted] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  /* =====================
     SYNC MODE FROM ROUTE
  ===================== */
  useEffect(() => {
    if (location.state?.mode) {
      setMode(location.state.mode);
    }
  }, [location.state]);

  /* =====================
     CHECK PROFILE STATUS
  ===================== */
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const res = await employerService.checkProfile();
        setProfileCompleted(res.completed);
        setShowWarning(!res.completed);
      } catch (err) {
        console.error("CHECK EMPLOYER PROFILE ERROR:", err);
      }
    };
    checkProfile();
  }, []);

  /* =====================
     MODE GUARD
  ===================== */
  const handleChangeMode = (newMode) => {
    if (newMode === "create" && !profileCompleted) {
      setShowWarning(true);
      return;
    }

    if (newMode !== "profile") {
      setProfileMode("view");
    }

    setMode(newMode);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        {/* HEADER */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-gray-900">
            Bảng điều khiển nhà tuyển dụng
          </h1>
          <p className="text-sm text-gray-500">
            Quản lý doanh nghiệp, tin tuyển dụng và ứng viên
          </p>
        </div>

        {/* LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SIDEBAR */}
          <aside className="lg:col-span-3 space-y-6">
            <UserAvatar />

            <EmployerSideBarTool
              currentMode={mode}
              setMode={handleChangeMode}
              setProfileMode={setProfileMode}
            />
          </aside>

          {/* CONTENT */}
          <main className="lg:col-span-9 space-y-6">
            {/* WARNING */}
            {showWarning && !profileCompleted && (
              <div className="flex items-start gap-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-yellow-900">
                    Hồ sơ công ty chưa hoàn thiện
                  </p>
                  <p className="text-sm text-yellow-800 mt-1">
                    Bạn cần hoàn thiện hồ sơ doanh nghiệp trước khi đăng tin
                    tuyển dụng hoặc sử dụng đầy đủ tính năng.
                  </p>

                  <button
                    onClick={() => {
                      setMode("profile");
                      setProfileMode("edit");
                    }}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:underline"
                  >
                    Hoàn thiện hồ sơ ngay →
                  </button>
                </div>
              </div>
            )}

            {/* PROFILE */}
            {mode === "profile" && (
              <>
                {profileMode === "view" ? (
                  <EmployerProfileView
                    onEdit={() => setProfileMode("edit")}
                  />
                ) : (
                  <EmployerProfileForm
                    onProfileCompleted={() => {
                      setProfileCompleted(true);
                      setShowWarning(false);
                      setProfileMode("view");
                    }}
                  />
                )}
              </>
            )}

            {/* JOBS */}
            {mode === "jobs" && <EmployerJobList />}

            {/* CREATE JOB */}
            {mode === "create" && profileCompleted && (
              <CreateJobForm />
            )}

            {/* PAYMENT */}
            {mode === "payment" && <EmployerPayment />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default EmployerPage;
