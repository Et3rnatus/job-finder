import { useEffect, useState } from "react";
import employerService from "../../services/employerService";
import vnAddress from "../../data/vn-address.json";
import {
  Building2,
  Globe,
  FileText,
  MapPin,
  Save,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function EmployerProfileForm({ onProfileCompleted }) {
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    employerService
      .getProfile()
      .then((data) => {
        const cityData = vnAddress.find(
          (c) => c.Name === data.city
        );
        const districtData =
          cityData?.Districts?.find(
            (d) => d.Name === data.district
          );

        setForm({
          company_name: data.company_name || "",
          website: data.website || "",
          description: data.description || "",
          city: cityData?.Id || "",
          district: districtData?.Id || "",
          address_detail: data.address_detail || "",
          business_license:
            data.business_license || "",
        });

        setDistricts(
          cityData ? cityData.Districts : []
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    const cityData = vnAddress.find(
      (c) => c.Id === cityId
    );

    setForm({ ...form, city: cityId, district: "" });
    setDistricts(cityData ? cityData.Districts : []);
    setErrors({ ...errors, city: "", district: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.company_name)
      e.company_name = "Tên công ty không được để trống";
    if (!form.city)
      e.city = "Vui lòng chọn tỉnh / thành phố";
    if (!form.district)
      e.district = "Vui lòng chọn quận / huyện";
    if (!form.address_detail)
      e.address_detail = "Vui lòng nhập địa chỉ chi tiết";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const cityName =
      vnAddress.find((c) => c.Id === form.city)?.Name || "";
    const districtName =
      districts.find((d) => d.Id === form.district)?.Name || "";

    try {
      setSaving(true);
      await employerService.updateProfile({
        ...form,
        city: cityName,
        district: districtName,
      });
      onProfileCompleted && onProfileCompleted();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border rounded-3xl p-16 text-center text-gray-500 flex flex-col items-center gap-3">
        <Loader2 className="animate-spin" />
        Đang tải hồ sơ doanh nghiệp...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-3xl p-12 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-12">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <Building2 size={26} />
        </div>
        <div>
          <h2 className="text-3xl font-semibold">
            Hồ sơ doanh nghiệp
          </h2>
          <p className="text-gray-500">
            Thông tin hiển thị cho ứng viên
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-14">
        <Section icon={<Building2 />} title="Thông tin doanh nghiệp">
          <Input
            label="Tên công ty *"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            error={errors.company_name}
          />
          <Grid>
            <Input
              label="Website"
              name="website"
              value={form.website}
              onChange={handleChange}
              icon={<Globe size={16} />}
            />
            <Input
              label="Giấy phép kinh doanh"
              name="business_license"
              value={form.business_license}
              onChange={handleChange}
              icon={<FileText size={16} />}
            />
          </Grid>
        </Section>

        <Section icon={<MapPin />} title="Địa chỉ công ty">
          <Grid>
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
          </Grid>

          <Input
            label="Số nhà, tên đường *"
            name="address_detail"
            value={form.address_detail}
            onChange={handleChange}
            error={errors.address_detail}
          />
        </Section>

        <Section icon={<FileText />} title="Giới thiệu công ty">
          <Textarea
            label="Mô tả ngắn gọn về doanh nghiệp"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </Section>

        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-10 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:bg-gray-400"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Lưu hồ sơ
          </button>

          <button
            type="button"
            onClick={onProfileCompleted}
            className="inline-flex items-center gap-2 px-10 py-3 rounded-full bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
          >
            <X size={16} />
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

/* UI */

const Section = ({ icon, title, children }) => (
  <section>
    <div className="flex items-center gap-2 mb-5 text-gray-900">
      <span className="text-emerald-600">{icon}</span>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);

const Grid = ({ children }) => (
  <div className="grid md:grid-cols-2 gap-4">
    {children}
  </div>
);

const Input = ({ label, error, icon, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      )}
      <input
        {...props}
        className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-emerald-500 ${
          icon ? "pl-10" : ""
        } ${error ? "border-red-500" : "border-gray-300"}`}
      />
    </div>
    {error && (
      <p className="text-sm text-red-500 mt-1">
        {error}
      </p>
    )}
  </div>
);

const Select = ({ label, error, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">
      {label}
    </label>
    <select
      {...props}
      className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-emerald-500 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && (
      <p className="text-sm text-red-500 mt-1">
        {error}
      </p>
    )}
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">
      {label}
    </label>
    <textarea
      {...props}
      rows={5}
      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500"
    />
  </div>
);
