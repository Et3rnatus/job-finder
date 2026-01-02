import { useEffect, useState } from "react";
import UserAvatar from "../components/candidate/UserAvatar";
import UserSidebarTool from "../components/candidate/UserSidebarTool";
import AppliedJobList from "../components/candidate/AppliedJobList";
import EditProfileForm from "../components/candidate/EditProfileForm";
import UserProfileInfo from "../components/candidate/UserProfileInfo";
import candidateService from "../services/candidateService";

function CandidatePage() {
  const [mode, setMode] = useState("view");
  const [profile, setProfile] = useState(null);

  // 🔑 trạng thái nghiệp vụ
  const [profileCompleted, setProfileCompleted] = useState(true);
  const [missingFields, setMissingFields] = useState([]);

  /* ===== LOAD ALL DATA ===== */
  const loadCandidateData = async () => {
    try {
      const profileRes = await candidateService.getProfile();
      setProfile(profileRes);

      const checkRes = await candidateService.checkProfile();
      setProfileCompleted(checkRes.is_profile_completed);
      setMissingFields(checkRes.missing_fields || []);
    } catch (error) {
      console.error("LOAD CANDIDATE DATA ERROR:", error);
    }
  };

  useEffect(() => {
    loadCandidateData();
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
        {/* LEFT */}
        <div className="space-y-6">
          <UserAvatar
            fullName={profile.full_name}
            isProfileCompleted={profileCompleted}
          />

          <UserSidebarTool onEditProfile={() => setMode("edit")} />
        </div>

        {/* RIGHT */}
        <div className="md:col-span-3 space-y-6">
          {/* 🔔 CẢNH BÁO */}
          {!profileCompleted && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
              <p className="font-semibold">
                Hồ sơ của bạn chưa hoàn thiện
              </p>
              <p className="text-sm mt-1">
                Vui lòng cập nhật hồ sơ để có thể ứng tuyển công việc.
              </p>
            </div>
          )}

          {/* 🔍 THIẾU GÌ */}
          {!profileCompleted && missingFields.length > 0 && (
            <div className="bg-white border rounded p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Thông tin còn thiếu:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {missingFields.map((field, index) => (
                  <li key={index}>{field}</li>
                ))}
              </ul>

              <button
                className="mt-3 text-green-600 text-sm font-medium hover:underline"
                onClick={() => setMode("edit")}
              >
                Cập nhật hồ sơ
              </button>
            </div>
          )}

          {mode === "view" && (
            <>
              <UserProfileInfo profile={profile} />
              {profileCompleted && <AppliedJobList />}
            </>
          )}

          {mode === "edit" && (
            <EditProfileForm
              profile={profile}
              onUpdated={async () => {
                // 🔥 reload toàn bộ dữ liệu từ BE
                await loadCandidateData();
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
