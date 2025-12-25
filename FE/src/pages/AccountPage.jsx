import UserAvatar from "../components/account/UserAvatar";
import UserSidebarTool from "../components/account/UserSidebarTool";
import UserInfo from "../components/account/UserInfo";
import AppliedJobList from "../components/account/AppliedJobList";

function AccountPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Cột trái */}
        <div>
          <UserAvatar />
          <UserSidebarTool />
        </div>

        {/* Cột phải */}
        <div className="md:col-span-3">
          <UserInfo />
          <AppliedJobList />
        </div>

      </div>
    </div>
  );
}

export default AccountPage;
