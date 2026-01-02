import { useEffect, useState } from "react";
import UserAvatar from "../components/employer/UserAvatar";
import EmployerSideBarTool from "../components/employer/EmployerSideBarTool";
import EmployerProfileForm from "../components/employer/EmployerProfileForm";
import EmployerProfileView from "../components/employer/EmployerProfileView";
import EmployerJobList from "../components/employer/EmployerJobList";
import CreateJobForm from "../components/employer/CreateJobForm";
import employerService from "../services/employerService";

function EmployerPage() {
  const [mode, setMode] = useState("profile"); 
  const [profileMode, setProfileMode] = useState("view"); 
  const [profileCompleted, setProfileCompleted] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

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


  const handleChangeMode = (newMode) => {
    if (newMode === "create" && !profileCompleted) {
      alert(
        "Hồ sơ công ty chưa hoàn tất. Vui lòng cập nhật hồ sơ trước khi đăng tin."
      );
      setShowWarning(true);
      return;
    }

  
    if (newMode !== "profile") {
      setProfileMode("view");
    }

    setMode(newMode);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    
        <div className="space-y-6">
          <UserAvatar />
          <EmployerSideBarTool
            setMode={handleChangeMode}
            setProfileMode={setProfileMode}
          />
        </div>

   
        <div className="md:col-span-3 space-y-6">
        
          {showWarning && !profileCompleted && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
              Hồ sơ công ty của bạn chưa hoàn tất. Vui lòng hoàn thiện hồ sơ để
              sử dụng đầy đủ chức năng.
            </div>
          )}

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

           
              <EmployerJobList />
            </>
          )}

   
          {mode === "create" && profileCompleted && <CreateJobForm />}
        </div>
      </div>
    </div>
  );
}

export default EmployerPage;
