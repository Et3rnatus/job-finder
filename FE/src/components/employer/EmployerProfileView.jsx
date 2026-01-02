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

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  if (!profile) {
    return <div className="text-gray-500">Chưa có dữ liệu hồ sơ</div>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Hồ sơ công ty
      </h3>

      <div className="space-y-4 text-sm text-gray-700">
        <div>
          <span className="font-medium">Tên công ty:</span>{" "}
          {profile.company_name || "—"}
        </div>

        <div>
          <span className="font-medium">Website:</span>{" "}
          {profile.website || "—"}
        </div>

        <div>
          <span className="font-medium">Địa chỉ:</span>{" "}
          {profile.address_detail
            ? `${profile.address_detail}, ${profile.district}, ${profile.city}`
            : "—"}
        </div>

        <div>
          <span className="font-medium">Giấy phép kinh doanh:</span>{" "}
          {profile.business_license || "—"}
        </div>

        <div>
          <span className="font-medium">Giới thiệu:</span>
          <p className="mt-1 whitespace-pre-line text-gray-600">
            {profile.description || "—"}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={onEdit}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-medium"
        >
          Cập nhật hồ sơ
        </button>
      </div>
    </div>
  );
}

export default EmployerProfileView;
