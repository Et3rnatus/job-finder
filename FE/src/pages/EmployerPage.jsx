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
  const [profileCompleted, setProfileCompleted] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  // 🔹 check hồ sơ khi vào trang
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const res = await employerService.checkProfile();
        setProfileCompleted(res.completed);

        if (!res.completed) {
          setShowWarning(true);
        }
      } catch (error) {
        console.error("CHECK PROFILE ERROR:", error);
      }
    };

    checkProfile();
  }, []);

  // 🔹 đổi mode + chặn tạo job khi hồ sơ chưa hoàn thiện
  const handleChangeMode = (newMode) => {
    if (newMode === "create" && !profileCompleted) {
      alert(
        "Hồ sơ công ty chưa hoàn tất. Vui lòng cập nhật hồ sơ trước khi đăng tin."
      );
      setShowWarning(true);
      return;
    }

    // rời profile thì reset về view
    if (newMode !== "profile") {
      setProfileMode("view");
    }

    setMode(newMode);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* LEFT SIDEBAR */}
        <div className="space-y-6">
          <UserAvatar />
          <EmployerSideBarTool setMode={handleChangeMode}   setProfileMode={setProfileMode} />
        </div>

        {/* RIGHT CONTENT */}
        <div className="md:col-span-3 space-y-6">
          {/* 🔔 CẢNH BÁO HỒ SƠ */}
          {showWarning && !profileCompleted && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
              Hồ sơ công ty của bạn chưa hoàn tất. Vui lòng hoàn thiện hồ sơ để
              sử dụng đầy đủ chức năng.
            </div>
          )}

          {/* CONTENT */}
          {mode === "profile" && (
            profileMode === "view" ? (
              <EmployerProfileView
                onEdit={() => setProfileMode("edit")}
              />
            ) : (
              <EmployerProfileForm
                onProfileCompleted={() => {
                  setProfileCompleted(true);
                  setShowWarning(false);
                  setProfileMode("view"); // lưu xong quay lại xem
                }}
              />
            )
          )}

          {mode === "jobs" && <EmployerJobList />}

          {mode === "create" && profileCompleted && <CreateJobForm />}
        </div>
      </div>
    </div>
  );
}

export default EmployerPage;
