import { useState } from "react";
import UserAvatar from "../components/candidate/UserAvatar";
import UserSidebarTool from "../components/candidate/UserSidebarTool";
import AppliedJobList from "../components/candidate/AppliedJobList";
import EditProfileForm from "../components/candidate/EditProfileForm";
import UserProfileInfo from "../components/candidate/UserProfileInfo";

function AccountPage() {
  const [mode, setMode] = useState("view"); // view | edit

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* LEFT SIDEBAR */}
        <div className="space-y-6">
          <UserAvatar />
          <UserSidebarTool onEditProfile={() => setMode("edit")} />
        </div>

        {/* RIGHT CONTENT */}
        <div className="md:col-span-3 space-y-8">
          {mode === "view" && (
            <>
              {/* PROFILE INFO */}
              <UserProfileInfo />

              {/* APPLIED JOB LIST */}
              <AppliedJobList />
            </>
          )}

          {mode === "edit" && (
            <EditProfileForm onCancel={() => setMode("view")} />
          )}
        </div>

      </div>
    </div>
  );
}

export default AccountPage;
