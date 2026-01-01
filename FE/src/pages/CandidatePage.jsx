import { useEffect, useState } from "react";
import UserAvatar from "../components/candidate/UserAvatar";
import UserSidebarTool from "../components/candidate/UserSidebarTool";
import AppliedJobList from "../components/candidate/AppliedJobList";
import EditProfileForm from "../components/candidate/EditProfileForm";
import UserProfileInfo from "../components/candidate/UserProfileInfo";
import candidateService from "../services/candidateService";

function CandidatePage() {
  const [mode, setMode] = useState("view"); // view | edit
  const [profile, setProfile] = useState(null);

  // derived state (KHÔNG LƯU RIÊNG)
  const profileCompleted = !!profile?.is_profile_completed;

  // 🔹 load profile khi vào trang
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileRes = await candidateService.getProfile();
        setProfile(profileRes);
      } catch (error) {
        console.error("LOAD CANDIDATE PROFILE ERROR:", error);
      }
    };

    loadProfile();
  }, []);

  if (!profile) {
    return (
      <div className="text-center py-10 text-gray-600">
        Đang tải hồ sơ ứng viên...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* LEFT SIDEBAR */}
        <div className="space-y-6">
          <UserAvatar
            fullName={profile.full_name}
            isProfileCompleted={profileCompleted}
          />

          <UserSidebarTool
            onEditProfile={() => setMode("edit")}
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="md:col-span-3 space-y-6">

          {/* 🔔 WARNING */}
          {!profileCompleted && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
              Hồ sơ của bạn chưa hoàn thiện. Vui lòng cập nhật hồ sơ để có thể
              ứng tuyển công việc.
            </div>
          )}

          {/* VIEW MODE */}
          {mode === "view" && (
            <>
              <UserProfileInfo profile={profile} />

              {/* 🔒 Applied jobs chỉ hiện khi hồ sơ hoàn thiện */}
              {profileCompleted && <AppliedJobList />}
            </>
          )}

          {/* EDIT MODE */}
          {mode === "edit" && (
            <EditProfileForm
              profile={profile}
              onUpdated={(updatedProfile, isCompleted) => {
                setProfile({
                  ...updatedProfile,
                  is_profile_completed: isCompleted,
                });
                setMode("view");
              }}
              onCancel={() => setMode("view")}
            />
          )}

        </div>
      </div>
    </div>
  );
}

export default CandidatePage;
