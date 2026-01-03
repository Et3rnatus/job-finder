import { useEffect, useState } from "react";
import UserAvatar from "../components/employer/UserAvatar";
import EmployerSideBarTool from "../components/employer/EmployerSideBarTool";
import EmployerProfileForm from "../components/employer/EmployerProfileForm";
import EmployerProfileView from "../components/employer/EmployerProfileView";
import EmployerJobList from "../components/employer/EmployerJobList";
import CreateJobForm from "../components/employer/CreateJobForm";
import employerService from "../services/employerService";

function EmployerPage() {
  const [mode, setMode] = useState("profile"); // profile | jobs | create
  const [profileMode, setProfileMode] = useState("view"); // view | edit

  // 🔑 nghiệp vụ
  const [profileCompleted, setProfileCompleted] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  /* =====================
     CHECK PROFILE STATUS
  ===================== */
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const res = await employerService.checkProfile();
        setProfileCompleted(res.completed);

        if (!res.completed) {
          setShowWarning(true);
        }
      } catch (error) {
        console.error("CHECK EMPLOYER PROFILE ERROR:", error);
      }
    };

    checkProfile();
  }, []);

  /* =====================
     CHANGE MODE (GUARD)
  ===================== */
  const handleChangeMode = (newMode) => {
    // ❌ chặn đăng tin khi hồ sơ chưa hoàn tất
    if (newMode === "create" && !profileCompleted) {
      setShowWarning(true);
      alert(
        "Hồ sơ công ty chưa hoàn tất. Vui lòng cập nhật hồ sơ trước khi đăng tin."
      );
      return;
    }

    // reset edit khi rời profile
    if (newMode !== "profile") {
      setProfileMode("view");
    }

    setMode(newMode);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* =====================
          HEADER
      ===================== */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Trang quản lý nhà tuyển dụng
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Quản lý hồ sơ công ty, tin tuyển dụng và ứng viên
        </p>
      </div>

      {/* =====================
          MAIN LAYOUT
      ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* =====================
            SIDEBAR
        ===================== */}
        <div className="space-y-6">
          <UserAvatar />

          <EmployerSideBarTool
            currentMode={mode}
            setMode={handleChangeMode}
            setProfileMode={setProfileMode}
          />
        </div>

        {/* =====================
            MAIN CONTENT
        ===================== */}
        <div className="md:col-span-3 space-y-6">
          {/* ⚠️ PROFILE WARNING */}
          {showWarning && !profileCompleted && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
              <p className="font-semibold text-yellow-800">
                Hồ sơ công ty chưa hoàn thiện
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Bạn cần hoàn thiện hồ sơ công ty trước khi có thể đăng
                tin tuyển dụng.
              </p>

              <button
                onClick={() => {
                  setMode("profile");
                  setProfileMode("edit");
                }}
                className="mt-3 text-sm font-medium text-green-600 hover:underline"
              >
                Hoàn thiện hồ sơ ngay →
              </button>
            </div>
          )}

          {/* =====================
              PROFILE
          ===================== */}
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

          {/* =====================
              JOB MANAGEMENT
          ===================== */}
          {mode === "jobs" && <EmployerJobList />}

          {/* =====================
              CREATE JOB
          ===================== */}
          {mode === "create" && profileCompleted && (
            <CreateJobForm />
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployerPage;
