import { useEffect, useState } from "react";
import UserAvatar from "../components/candidate/UserAvatar";
import UserSidebarTool from "../components/candidate/UserSidebarTool";
import EditProfileForm from "../components/candidate/EditProfileForm";
import UserProfileInfo from "../components/candidate/UserProfileInfo";
import ChangePassword from "../components/candidate/ChangePassword";
import candidateService from "../services/candidateService";

function CandidatePage() {
  const [mode, setMode] = useState("view"); // view | edit | password
  const [profile, setProfile] = useState(null);
  const [profileCompleted, setProfileCompleted] = useState(true);
  const [missingFields, setMissingFields] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCandidateData = async () => {
    try {
      setLoading(true);
      const profileRes = await candidateService.getProfile();
      const checkRes = await candidateService.checkProfile();

      setProfile(profileRes);
      setProfileCompleted(checkRes.is_profile_completed);
      setMissingFields(checkRes.missing_fields || []);
    } catch (error) {
      console.error("LOAD CANDIDATE DATA ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidateData();
  }, []);

  if (loading || !profile) {
    return (
      <div className="py-20 text-center text-gray-500">
        Đang tải hồ sơ ứng viên...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Hồ sơ ứng viên
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Quản lý thông tin cá nhân và hồ sơ ứng tuyển
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* LEFT */}
        <div className="space-y-6">
          <UserAvatar
            name={profile.full_name}
            image={profile.candidate_image}
            label="Thay đổi ảnh đại diện"
            onUpload={async (file) => {
              const res = await candidateService.updateAvatar(file);
              await loadCandidateData(); // reload profile
              return res.candidate_image;
            }}
          />

          <UserSidebarTool
            onEditProfile={() => setMode("edit")}
            onChangePassword={() => setMode("password")}
          />
        </div>

        {/* RIGHT */}
        <div className="md:col-span-3 space-y-6">
          {!profileCompleted && mode !== "password" && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-5">
              <p className="font-semibold text-yellow-800">
                Hồ sơ chưa hoàn thiện
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Bạn cần hoàn thiện hồ sơ trước khi ứng tuyển.
              </p>

              {missingFields.length > 0 && (
                <ul className="mt-3 list-disc list-inside text-sm text-yellow-700">
                  {missingFields.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => setMode("edit")}
                className="mt-4 text-sm font-semibold text-green-600 hover:underline"
              >
                Cập nhật hồ sơ ngay →
              </button>
            </div>
          )}

          {mode === "view" && (
            <UserProfileInfo profile={profile} />
          )}

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

          {mode === "password" && (
            <ChangePassword
              onCancel={() => setMode("view")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CandidatePage;
