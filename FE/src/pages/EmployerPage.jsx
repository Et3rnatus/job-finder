import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import UserAvatar from "../components/employer/UserAvatar";
import EmployerSideBarTool from "../components/employer/EmployerSideBarTool";
import EmployerProfileForm from "../components/employer/EmployerProfileForm";
import EmployerProfileView from "../components/employer/EmployerProfileView";
import EmployerJobList from "../components/employer/EmployerJobList";
import CreateJobForm from "../components/employer/CreateJobForm";
import EmployerPayment from "../components/employer/EmployerPayment";
import EmployerPaymentHistory from "../components/employer/EmployerPaymentHistory";
import EmployerPackageSummary from "../components/employer/EmployerPackageSummary";

import employerService from "../services/employerService";

function EmployerPage() {
  const location = useLocation();

  /* =====================
     STATE
  ===================== */
  const [mode, setMode] = useState("profile");
  // profile | jobs | create | payment | payment-history | package
  const [profileMode, setProfileMode] = useState("view");

  const [profile, setProfile] = useState(null);
  const [profileCompleted, setProfileCompleted] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(true);

  /* =====================
     SYNC MODE FROM ROUTE
  ===================== */
  useEffect(() => {
    if (location.state?.mode) {
      setMode(location.state.mode);
    }
  }, [location.state]);

  /* =====================
     LOAD EMPLOYER DATA
  ===================== */
  const loadEmployerData = async () => {
    try {
      setLoading(true);
      const profileRes = await employerService.getProfile();
      const checkRes = await employerService.checkProfile();

      setProfile(profileRes);
      setProfileCompleted(checkRes.completed);
      setShowWarning(!checkRes.completed);
    } catch (err) {
      console.error("LOAD EMPLOYER DATA ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployerData();
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

  /* =====================
     LOADING
  ===================== */
  if (loading || !profile) {
    return (
      <div className="py-20 text-center text-gray-500">
        Đang tải hồ sơ nhà tuyển dụng...
      </div>
    );
  }

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

          <div className="mt-2 flex items-center gap-2 text-sm">
            {profileCompleted ? (
              <>
                <CheckCircle2 size={16} className="text-green-600" />
                <span className="text-green-700 font-medium">
                  Hồ sơ công ty đã hoàn thiện
                </span>
              </>
            ) : (
              <>
                <AlertTriangle size={16} className="text-yellow-600" />
                <span className="text-yellow-700 font-medium">
                  Hồ sơ công ty chưa hoàn thiện
                </span>
              </>
            )}
          </div>
        </div>

        {/* LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SIDEBAR */}
          <aside className="lg:col-span-3 space-y-6">
            <UserAvatar
              name={profile.company_name}
              image={profile.logo}
              label="Thay đổi logo công ty"
              defaultImage="/default-company.png"
              onUpload={async (file) => {
                await employerService.updateLogo(file);
                await loadEmployerData();
              }}
            />

            <EmployerSideBarTool
              currentMode={mode}
              setMode={handleChangeMode}
              setProfileMode={setProfileMode}
            />
          </aside>

          {/* MAIN */}
          <main className="lg:col-span-9 space-y-6">
            {/* WARNING */}
            {showWarning && !profileCompleted && (
              <div className="flex items-start gap-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
                <AlertTriangle className="text-yellow-700" />
                <div>
                  <p className="font-semibold text-yellow-900">
                    Hồ sơ công ty chưa hoàn thiện
                  </p>
                  <p className="text-sm text-yellow-800">
                    Bạn cần hoàn thiện hồ sơ trước khi đăng tin.
                  </p>
                </div>
              </div>
            )}

            {/* PROFILE */}
            {mode === "profile" &&
              (profileMode === "view" ? (
                <EmployerProfileView
                  profile={profile}
                  onEdit={() => setProfileMode("edit")}
                />
              ) : (
                <EmployerProfileForm
                  profile={profile}
                  onProfileCompleted={() => {
                    setProfileCompleted(true);
                    setShowWarning(false);
                    setProfileMode("view");
                  }}
                />
              ))}

            {/* JOBS */}
            {mode === "jobs" && <EmployerJobList />}

            {/* CREATE */}
            {mode === "create" && profileCompleted && <CreateJobForm />}

            {/* PAYMENT */}
            {mode === "payment" && <EmployerPayment />}

            {/* PAYMENT HISTORY */}
            {mode === "payment-history" && <EmployerPaymentHistory />}

            {/* PACKAGE SUMMARY */}
            {mode === "package" && <EmployerPackageSummary />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default EmployerPage;
