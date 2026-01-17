import { useEffect, useState, useMemo } from "react";
import {
  User,
  Edit3,
  Lock,
  AlertTriangle,
  Loader2,
} from "lucide-react";

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

  /* =====================
     PROFILE COMPLETION %
  ===================== */
  const completionPercent = useMemo(() => {
    if (!missingFields || missingFields.length === 0) return 100;
    const total = missingFields.length + 5; // giả định form ~5 nhóm chính
    return Math.max(
      20,
      Math.round(((total - missingFields.length) / total) * 100)
    );
  }, [missingFields]);

  /* =====================
     LOADING
  ===================== */
  if (loading || !profile) {
    return (
      <div className="py-24 flex flex-col items-center gap-4 text-gray-500">
        <Loader2 size={28} className="animate-spin" />
        Đang tải hồ sơ ứng viên...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* =====================
          HEADER
      ===================== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Hồ sơ ứng viên
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý thông tin cá nhân và hồ sơ ứng tuyển
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2">
          <HeaderAction
            active={mode === "view"}
            icon={<User size={14} />}
            onClick={() => setMode("view")}
          >
            Thông tin
          </HeaderAction>

          <HeaderAction
            active={mode === "edit"}
            icon={<Edit3 size={14} />}
            onClick={() => setMode("edit")}
          >
            Chỉnh sửa
          </HeaderAction>

          <HeaderAction
            active={mode === "password"}
            icon={<Lock size={14} />}
            onClick={() => setMode("password")}
          >
            Bảo mật
          </HeaderAction>
        </div>
      </div>

      {/* =====================
          PROFILE COMPLETION
      ===================== */}
      {!profileCompleted && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-yellow-600 mt-1" />
            <div className="flex-1">
              <p className="font-semibold text-yellow-800">
                Hồ sơ chưa hoàn thiện
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Bạn cần hoàn thiện hồ sơ trước khi ứng tuyển.
              </p>

              {/* PROGRESS */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-yellow-700 mb-1">
                  <span>Mức độ hoàn thiện</span>
                  <span>{completionPercent}%</span>
                </div>
                <div className="h-2 rounded-full bg-yellow-200 overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 transition-all"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>

              {missingFields.length > 0 && (
                <ul className="mt-4 list-disc list-inside text-sm text-yellow-700">
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
          </div>
        </div>
      )}

      {/* =====================
          MAIN GRID
      ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* LEFT */}
        <div className="space-y-6">
          <UserAvatar
            name={profile.full_name}
            image={profile.candidate_image}
            label="Thay đổi ảnh đại diện"
            onUpload={async (file) => {
              await candidateService.updateAvatar(file);
              await loadCandidateData();
            }}
          />

          <UserSidebarTool
            onEditProfile={() => setMode("edit")}
            onChangePassword={() => setMode("password")}
          />
        </div>

        {/* RIGHT */}
        <div className="md:col-span-3 space-y-6">
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
            <ChangePassword onCancel={() => setMode("view")} />
          )}
        </div>
      </div>
    </div>
  );
}

/* =====================
   SUB COMPONENTS
===================== */

function HeaderAction({ active, icon, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-2
        px-4 py-2 rounded-full
        text-sm font-semibold
        transition
        ${
          active
            ? "bg-green-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }
      `}
    >
      {icon}
      {children}
    </button>
  );
}

export default CandidatePage;
