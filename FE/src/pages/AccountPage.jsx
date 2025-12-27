import { useState } from "react";
import UserAvatar from "../components/account/UserAvatar";
import UserSidebarTool from "../components/account/UserSidebarTool";
import AppliedJobList from "../components/account/AppliedJobList";
import EditProfileForm from "../components/account/EditProfileForm";

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
