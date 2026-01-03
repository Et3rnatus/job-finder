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

  /* =====================
     LOAD PROFILE
  ===================== */
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
      .catch(() => setLoading(false));
  }, []);

  /* =====================
     HANDLERS
  ===================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    const cityData = vnAddress.find((c) => c.Id === cityId);

    setForm({ ...form, city: cityId, district: "" });
    setDistricts(cityData ? cityData.Districts : []);
    setErrors({ ...errors, city: "", district: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.company_name)
      newErrors.company_name = "Tên công ty không được để trống";
    if (!form.city)
      newErrors.city = "Vui lòng chọn tỉnh / thành phố";
    if (!form.district)
      newErrors.district = "Vui lòng chọn quận / huyện";
    if (!form.address_detail)
      newErrors.address_detail = "Vui lòng nhập địa chỉ chi tiết";

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
      onProfileCompleted && onProfileCompleted();
    } catch (error) {
      alert(error.response?.data?.message || "Cập nhật thất bại");
    }
  };

  const handleCancel = () => {
    onProfileCompleted && onProfileCompleted();
  };

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

  /* =====================
     RENDER
  ===================== */
  return (
    <div className="bg-white border rounded-xl p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800">
          Hồ sơ doanh nghiệp
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Thông tin này sẽ hiển thị cho ứng viên khi xem tin tuyển dụng
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* ===== DOANH NGHIỆP ===== */}
        <FormSection title="Thông tin doanh nghiệp">
          <Input
            label="Tên công ty *"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            error={errors.company_name}
          />

          <Input
            label="Website"
            name="website"
            value={form.website}
            onChange={handleChange}
          />

          <Input
            label="Giấy phép kinh doanh"
            name="business_license"
            value={form.business_license}
            onChange={handleChange}
          />
        </FormSection>

        {/* ===== ĐỊA CHỈ ===== */}
        <FormSection title="Địa chỉ công ty">
          <Select
            label="Tỉnh / Thành phố *"
            value={form.city}
            onChange={handleCityChange}
            error={errors.city}
          >
            <option value="">Chọn tỉnh / thành phố</option>
            {vnAddress.map((c) => (
              <option key={c.Id} value={c.Id}>
                {c.Name}
              </option>
            ))}
          </Select>

          <Select
            label="Quận / Huyện *"
            name="district"
            value={form.district}
            onChange={handleChange}
            disabled={!form.city}
            error={errors.district}
          >
            <option value="">Chọn quận / huyện</option>
            {districts.map((d) => (
              <option key={d.Id} value={d.Id}>
                {d.Name}
              </option>
            ))}
          </Select>

          <Input
            label="Số nhà, tên đường *"
            name="address_detail"
            value={form.address_detail}
            onChange={handleChange}
            error={errors.address_detail}
          />
        </FormSection>

        {/* ===== GIỚI THIỆU ===== */}
        <FormSection title="Giới thiệu công ty">
          <Textarea
            label="Mô tả ngắn gọn về doanh nghiệp"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </FormSection>

        {/* ===== ACTION ===== */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 font-medium"
          >
            Lưu hồ sơ
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 font-medium"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

/* =====================
   UI COMPONENTS
===================== */

function FormSection({ title, children }) {
  return (
    <section>
      <h4 className="text-lg font-semibold text-gray-800 mb-4">
        {title}
      </h4>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Input({ label, error, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        {...props}
        className={`w-full border p-3 rounded-lg ${
          error ? "border-red-500" : ""
        }`}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

function Select({ label, error, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>
      <select
        {...props}
        className={`w-full border p-3 rounded-lg ${
          error ? "border-red-500" : ""
        }`}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>
      <textarea
        {...props}
        rows={5}
        className="w-full border p-3 rounded-lg"
      />
    </div>
  );
}

export default EmployerProfileForm;
