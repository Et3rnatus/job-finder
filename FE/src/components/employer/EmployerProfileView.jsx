import { useEffect, useState } from "react";
import employerService from "../../services/employerService";
import {
  Building2,
  Globe,
  MapPin,
  FileText,
  Pencil,
  Loader2,
} from "lucide-react";

export default function EmployerProfileView({ onEdit }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    employerService
      .getProfile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white border rounded-3xl p-16 flex flex-col items-center gap-3 text-gray-500">
        <Loader2 className="animate-spin" />
        Đang tải hồ sơ doanh nghiệp...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white border rounded-3xl p-16 text-center text-gray-500">
        Chưa có dữ liệu hồ sơ doanh nghiệp
      </div>
    );
  }

  const fullAddress = profile.address_detail
    ? `${profile.address_detail}, ${profile.district}, ${profile.city}`
    : "—";

  return (
    <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-3xl p-12 shadow-sm">
      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-6 mb-12">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Building2 size={30} />
          </div>

          <div>
            <h2 className="text-3xl font-semibold text-gray-900">
              {profile.company_name || "Tên công ty"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Hồ sơ doanh nghiệp
            </p>
          </div>
        </div>

        <button
          onClick={onEdit}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition"
        >
          <Pencil size={16} />
          Cập nhật hồ sơ
        </button>
      </div>

      {/* INFO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm mb-12">
        <InfoItem
          icon={<Globe size={18} />}
          label="Website"
          value={
            profile.website ? (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 hover:underline break-all"
              >
                {profile.website}
              </a>
            ) : (
              "—"
            )
          }
        />

        <InfoItem
          icon={<MapPin size={18} />}
          label="Địa chỉ"
          value={fullAddress}
        />

        <InfoItem
          icon={<FileText size={18} />}
          label="Giấy phép kinh doanh"
          value={profile.business_license || "—"}
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-5">
          Giới thiệu công ty
        </h3>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {profile.description || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* SUB COMPONENT */

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-800 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}
