import { useState } from "react";
import UserAvatar from "../components/employer/UserAvatar";
import EmployerSideBarTool from "../components/employer/EmployerSideBarTool";
import EmployerProfileForm from "../components/employer/EmployerProfileForm";
import EmployerJobList from "../components/employer/EmployerJobList";
import CreateJobForm from "../components/employer/CreateJobForm";

function EmployerPage() {
  const [mode, setMode] = useState("profile"); // profile | jobs | create

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* LEFT SIDEBAR */}
        <div className="space-y-6">
          <UserAvatar />
          <EmployerSideBarTool setMode={setMode} />
        </div>

        {/* RIGHT CONTENT */}
        <div className="md:col-span-3 space-y-6">
          {mode === "profile" && <EmployerProfileForm />}
          {mode === "jobs" && <EmployerJobList />}
          {mode === "create" && <CreateJobForm />}
        </div>

      </div>
    </div>
  );
}

export default EmployerPage;
