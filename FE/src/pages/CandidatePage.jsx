import { useEffect, useState } from "react";
import UserAvatar from "../components/candidate/UserAvatar";
import UserSidebarTool from "../components/candidate/UserSidebarTool";
import EditProfileForm from "../components/candidate/EditProfileForm";
import UserProfileInfo from "../components/candidate/UserProfileInfo";
import candidateService from "../services/candidateService";

function CandidatePage() {
  const [mode, setMode] = useState("view"); // view | edit
  const [profile, setProfile] = useState(null);

  // 🔑 nghiệp vụ
  const [profileCompleted, setProfileCompleted] = useState(true);
  const [missingFields, setMissingFields] = useState([]);

  /* =====================
     LOAD DATA
  ===================== */
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
      <div className="text-center py-16 text-gray-500">
        Đang tải hồ sơ ứng viên...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* =====================
          HEADER
      ===================== */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Hồ sơ ứng viên
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Quản lý thông tin cá nhân và hồ sơ ứng tuyển của bạn
        </p>
      </div>

      {/* =====================
          MAIN LAYOUT
      ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* =====================
            LEFT SIDEBAR
        ===================== */}
        <div className="space-y-6">
          <UserAvatar
            fullName={profile.full_name}
            isProfileCompleted={profileCompleted}
          />

          <UserSidebarTool
            onEditProfile={() => setMode("edit")}
          />
        </div>

        {/* =====================
            RIGHT CONTENT
        ===================== */}
        <div className="md:col-span-3 space-y-6">
          {/* 🔔 PROFILE WARNING */}
          {!profileCompleted && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
              <p className="font-semibold text-yellow-800">
                Hồ sơ của bạn chưa hoàn thiện
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Bạn cần hoàn thiện hồ sơ trước khi có thể ứng tuyển
                công việc.
              </p>

              {missingFields.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-yellow-800 mb-1">
                    Thông tin còn thiếu:
                  </p>
                  <ul className="list-disc list-inside text-sm text-yellow-700">
                    {missingFields.map((field, idx) => (
                      <li key={idx}>{field}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => setMode("edit")}
                className="mt-4 inline-block text-sm font-medium text-green-600 hover:underline"
              >
                Cập nhật hồ sơ ngay →
              </button>
            </div>
          )}

          {/* =====================
              VIEW MODE
          ===================== */}
          {mode === "view" && (
            <UserProfileInfo profile={profile} />
          )}

          {/* =====================
              EDIT MODE
          ===================== */}
          {mode === "edit" && (
            <EditProfileForm
              profile={profile}
              onUpdated={async () => {
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
