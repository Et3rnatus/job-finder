import { useEffect, useState } from "react";
import employerService from "../../services/employerService";

function EmployerProfileView({ onEdit }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    employerService
      .getProfile()
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => {
        alert("Không tải được hồ sơ công ty");
        setLoading(false);
      });
  }, []);

  /* =====================
     LOADING
  ===================== */
  if (loading) {
    return (
      <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
        Đang tải hồ sơ doanh nghiệp...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
        Chưa có dữ liệu hồ sơ công ty
      </div>
    );
  }

  const fullAddress = profile.address_detail
    ? `${profile.address_detail}, ${profile.district}, ${profile.city}`
    : "—";

  return (
    <div className="bg-white border rounded-xl p-8">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {profile.company_name || "Tên công ty"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Hồ sơ doanh nghiệp
          </p>
        </div>

        <button
          onClick={onEdit}
          className="
            px-5 py-2 text-sm font-medium
            bg-green-600 text-white rounded-full
            hover:bg-green-700 transition
          "
        >
          ✏️ Cập nhật hồ sơ
        </button>
      </div>

      {/* INFO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <InfoItem
          icon="🌐"
          label="Website"
          value={
            profile.website ? (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="text-green-600 hover:underline break-all"
              >
                {profile.website}
              </a>
            ) : (
              "—"
            )
          }
        />

        <InfoItem
          icon="📍"
          label="Địa chỉ"
          value={fullAddress}
        />

        <InfoItem
          icon="📄"
          label="Giấy phép kinh doanh"
          value={profile.business_license || "—"}
        />
      </div>

      {/* DESCRIPTION */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Giới thiệu công ty
        </h3>

        <div className="bg-gray-50 border rounded-lg p-4">
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {profile.description || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =====================
   SUB COMPONENT
===================== */

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex gap-4">
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 mb-1">
          {label}
        </p>
        <p className="text-gray-800 font-medium break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

export default EmployerProfileView;
