import { useEffect, useState } from "react";
import employerService from "../../services/employerService";
import vnAddress from "../../data/vn-address.json";

function EmployerProfileForm({ onProfileCompleted }) {
  const [form, setForm] = useState({
    company_name: "",
    website: "",
    description: "",
    city: "",
    district: "",
    address_detail: "",
    business_license: "",
  });

  const [districts, setDistricts] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // ================= LOAD PROFILE =================
  useEffect(() => {
    employerService
      .getProfile()
      .then((data) => {
        const cityData = vnAddress.find((c) => c.Name === data.city);
        const districtData = cityData?.Districts?.find(
          (d) => d.Name === data.district
        );

        setForm({
          company_name: data.company_name || "",
          website: data.website || "",
          description: data.description || "",
          city: cityData?.Id || "",
          district: districtData?.Id || "",
          address_detail: data.address_detail || "",
          business_license: data.business_license || "",
        });

        setDistricts(cityData ? cityData.Districts : []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    const cityData = vnAddress.find((c) => c.Id === cityId);

    setForm({
      ...form,
      city: cityId,
      district: "",
    });

    setDistricts(cityData ? cityData.Districts : []);

    setErrors({
      ...errors,
      city: "",
      district: "",
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.company_name) {
      newErrors.company_name = "Tên công ty không được để trống";
    }
    if (!form.city) {
      newErrors.city = "Vui lòng chọn tỉnh / thành phố";
    }
    if (!form.district) {
      newErrors.district = "Vui lòng chọn quận / huyện";
    }
    if (!form.address_detail) {
      newErrors.address_detail = "Vui lòng nhập địa chỉ chi tiết";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const cityName =
      vnAddress.find((c) => c.Id === form.city)?.Name || "";

    const districtName =
      districts.find((d) => d.Id === form.district)?.Name || "";

    const payload = {
      ...form,
      city: cityName,
      district: districtName,
    };

    try {
      await employerService.updateProfile(payload);

      if (onProfileCompleted) {
        onProfileCompleted();
      }
    } catch (error) {
      if (error.response?.status === 400) {
        alert(error.response.data.message);
      } else {
        alert("Cập nhật thất bại");
      }
    }
  };

  const handleCancel = () => {
    if (onProfileCompleted) {
      onProfileCompleted();
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Cập nhật hồ sơ công ty
      </h3>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <h4 className="text-base font-semibold text-gray-700 mb-3">
            Thông tin doanh nghiệp
          </h4>

          <input
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            placeholder="Tên công ty *"
            className={`w-full border p-3 rounded mb-1 ${
              errors.company_name ? "border-red-500" : ""
            }`}
          />
          {errors.company_name && (
            <p className="text-red-500 text-sm mb-3">
              {errors.company_name}
            </p>
          )}

          <input
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="Website công ty"
            className="w-full border p-3 rounded mb-3"
          />

          <input
            name="business_license"
            value={form.business_license}
            onChange={handleChange}
            placeholder="Giấy phép kinh doanh"
            className="w-full border p-3 rounded mb-3"
          />
        </section>

        <section>
          <h4 className="text-base font-semibold text-gray-700 mb-3">
            Địa chỉ công ty
          </h4>

          <select
            value={form.city}
            onChange={handleCityChange}
            className={`w-full border p-3 rounded mb-1 ${
              errors.city ? "border-red-500" : ""
            }`}
          >
            <option value="">Chọn tỉnh / thành phố *</option>
            {vnAddress.map((city) => (
              <option key={city.Id} value={city.Id}>
                {city.Name}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className="text-red-500 text-sm mb-3">{errors.city}</p>
          )}

          <select
            name="district"
            value={form.district}
            onChange={handleChange}
            disabled={!form.city}
            className={`w-full border p-3 rounded mb-1 ${
              errors.district ? "border-red-500" : ""
            } ${!form.city ? "bg-gray-100 cursor-not-allowed" : ""}`}
          >
            <option value="">Chọn quận / huyện *</option>
            {districts.map((d) => (
              <option key={d.Id} value={d.Id}>
                {d.Name}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="text-red-500 text-sm mb-3">
              {errors.district}
            </p>
          )}

          <input
            name="address_detail"
            value={form.address_detail}
            onChange={handleChange}
            placeholder="Số nhà, tên đường *"
            className={`w-full border p-3 rounded mb-1 ${
              errors.address_detail ? "border-red-500" : ""
            }`}
          />
          {errors.address_detail && (
            <p className="text-red-500 text-sm">
              {errors.address_detail}
            </p>
          )}
        </section>

        <section>
          <h4 className="text-base font-semibold text-gray-700 mb-3">
            Giới thiệu công ty
          </h4>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Mô tả ngắn gọn về công ty"
            rows="5"
            className="w-full border p-3 rounded"
          />
        </section>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-medium"
          >
            Lưu hồ sơ
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 font-medium"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployerProfileForm;
