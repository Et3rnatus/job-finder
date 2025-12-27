import { useState } from "react";
import UserAvatar from "../components/candidate/UserAvatar";
import UserSidebarTool from "../components/candidate/UserSidebarTool";
import AppliedJobList from "../components/candidate/AppliedJobList";
import EditProfileForm from "../components/candidate/EditProfileForm";

function AccountPage() {
  const [mode, setMode] = useState("view"); // view | edit

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* LEFT */}
        <div>
          <UserAvatar />
          <UserSidebarTool onEditProfile={() => setMode("edit")} />
        </div>

        {/* RIGHT */}
        <div className="md:col-span-3">
          {mode === "view" && <AppliedJobList />}
          {mode === "edit" && (
            <EditProfileForm onCancel={() => setMode("view")} />
          )}
        </div>

      </div>
    </div>
  );
}

export default AccountPage;
