import { useState } from "react";
import UserAvatar from "../components/employer/UserAvatar";
import EmployerSidebarTool from "../components/employer/EmployerSidebarTool";
import EmployerProfileForm from "../components/employer/EmployerProfileForm";

function EmployerPage() {
  const [mode, setMode] = useState("profile"); // profile | jobs | create

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* CỘT TRÁI */}
        <div>
          <UserAvatar />
          <EmployerSidebarTool setMode={setMode} />
        </div>

        {/* CỘT PHẢI */}
        <div className="md:col-span-3">
          {mode === "profile" && <EmployerProfileForm />}
          {mode === "jobs" && <EmployerJobList />}
          {mode === "create" && <CreateJobForm />}
        </div>

      </div>
    </div>
  );
}

export default EmployerPage;
