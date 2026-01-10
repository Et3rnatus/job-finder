import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import vnAddress from "../../data/vn-address.json";
import { createJob } from "../../services/jobService";
import { getSkillsByCategory } from "../../services/skillService";
import { getCategories } from "../../services/categoryService";

function CreateJobForm() {
  const navigate = useNavigate();

  const [districts, setDistricts] = useState([]);
  const [salaryNegotiable, setSalaryNegotiable] = useState(true);

  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);

  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    job_requirements: "",
    benefits: "",

    city: "",
    district: "",
    address_detail: "",

    min_salary: "",
    max_salary: "",

    employment_type: "",
    experience: "",
    hiring_quantity: "",
    expired_at: "",

    category_id: "",
    skill_ids: [],
  });

  /* =====================
     LOAD CATEGORIES
  ===================== */
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => alert("Không thể tải ngành nghề"));
  }, []);

  /* =====================
     LOAD SKILLS THEO CATEGORY
  ===================== */
  useEffect(() => {
    if (!form.category_id) {
      setSkills([]);
      setForm((prev) => ({ ...prev, skill_ids: [] }));
      return;
    }

    // reset skill khi đổi category
    setForm((prev) => ({ ...prev, skill_ids: [] }));

    getSkillsByCategory(form.category_id)
      .then(setSkills)
      .catch(() => alert("Không thể tải kỹ năng"));
  }, [form.category_id]);

  /* =====================
     HANDLERS
  ===================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "category_id" ? Number(value) : value,
    }));
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    const cityData = vnAddress.find((c) => c.Id === cityId);

    setForm((prev) => ({
      ...prev,
      city: cityId,
      district: "",
    }));

    setDistricts(cityData ? cityData.Districts : []);
  };

  /* =====================
     SUBMIT
  ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    /* ===== VALIDATE ===== */
    if (
      !form.title ||
      !form.description ||
      !form.job_requirements ||
      !form.benefits ||
      !form.employment_type ||
      !form.experience ||
      !form.hiring_quantity ||
      !form.expired_at ||
      !form.category_id
    ) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    if (!form.skill_ids.length) {
      alert("Vui lòng chọn ít nhất 1 kỹ năng");
      return;
    }

    if (
      !salaryNegotiable &&
      Number(form.min_salary) > Number(form.max_salary)
    ) {
      alert("Lương tối thiểu không được lớn hơn lương tối đa");
      return;
    }

    /* ===== BUILD LOCATION ===== */
    let location = null;
    if (form.city && form.district && form.address_detail) {
      const cityName =
        vnAddress.find((c) => c.Id === form.city)?.Name || "";
      const districtName =
        districts.find((d) => d.Id === form.district)?.Name || "";

      location = `${form.address_detail}, ${districtName}, ${cityName}`;
    }

    /* ===== PAYLOAD ===== */
    const payload = {
      title: form.title,
      description: form.description,
      job_requirements: form.job_requirements,
      benefits: form.benefits,
      location,
      employment_type: form.employment_type,
      experience: form.experience,
      hiring_quantity: Number(form.hiring_quantity),
      expired_at: form.expired_at,

      min_salary: salaryNegotiable ? null : Number(form.min_salary),
      max_salary: salaryNegotiable ? null : Number(form.max_salary),
      is_salary_negotiable: salaryNegotiable ? 1 : 0,

      category_id: form.category_id,
      skill_ids: form.skill_ids,
    };

    try {
      await createJob(payload);
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || "Tạo tin thất bại");
    }
  };

  /* =====================
     SUCCESS
  ===================== */
  if (success) {
    return (
      <div className="bg-white border rounded-xl p-12 text-center">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">
          🎉 Đăng tin tuyển dụng thành công
        </h2>
        <p className="text-gray-600 mb-8">
          Tin tuyển dụng đang chờ admin duyệt
        </p>
        <button
          onClick={() => navigate("/account/employer")}
          className="px-8 py-3 bg-green-600 text-white rounded-full"
        >
          Quay về trang quản lý
        </button>
      </div>
    );
  }

  /* =====================
     FORM
  ===================== */
  return (
    <div className="bg-white border rounded-xl p-8">
      <h2 className="text-2xl font-semibold mb-8">Đăng tin tuyển dụng</h2>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* BASIC INFO */}
        <FormSection title="Thông tin công việc">
          <Input name="title" value={form.title} onChange={handleChange} placeholder="Tên công việc" />

          <Select name="employment_type" value={form.employment_type} onChange={handleChange}>
            <option value="">Hình thức làm việc</option>
            <option value="fulltime">Toàn thời gian</option>
            <option value="parttime">Bán thời gian</option>
            <option value="intern">Thực tập</option>
          </Select>

          <Select name="experience" value={form.experience} onChange={handleChange}>
            <option value="">Yêu cầu kinh nghiệm</option>
            <option value="no_experience">Không yêu cầu</option>
            <option value="under_1_year">Dưới 1 năm</option>
            <option value="1_year">1 năm</option>
            <option value="2_3_years">2–3 năm</option>
            <option value="over_3_years">Trên 3 năm</option>
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <Input type="number" min={1} name="hiring_quantity" value={form.hiring_quantity} onChange={handleChange} placeholder="Số lượng tuyển" />
            <Input type="date" name="expired_at" value={form.expired_at} onChange={handleChange} />
          </div>
        </FormSection>

        {/* CATEGORY */}
        <FormSection title="Ngành nghề">
          <Select name="category_id" value={form.category_id} onChange={handleChange}>
            <option value="">-- Chọn ngành nghề --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </FormSection>

        {/* SKILLS */}
        <FormSection title="Kỹ năng yêu cầu">
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <label key={skill.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.skill_ids.includes(skill.id)}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      skill_ids: e.target.checked
                        ? [...prev.skill_ids, skill.id]
                        : prev.skill_ids.filter((id) => id !== skill.id),
                    }))
                  }
                />
                {skill.name}
              </label>
            ))}
          </div>
        </FormSection>

        {/* DESCRIPTION */}
        <FormSection title="Mô tả & yêu cầu">
          <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Mô tả công việc" />
          <Textarea name="job_requirements" value={form.job_requirements} onChange={handleChange} placeholder="Yêu cầu ứng viên" />
        </FormSection>

        {/* BENEFITS */}
        <FormSection title="Quyền lợi">
          <Textarea name="benefits" value={form.benefits} onChange={handleChange} placeholder="Quyền lợi" />
        </FormSection>

        {/* SALARY */}
        <FormSection title="Mức lương">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={salaryNegotiable} onChange={() => setSalaryNegotiable(!salaryNegotiable)} />
            Lương thỏa thuận
          </label>

          {!salaryNegotiable && (
            <div className="grid grid-cols-2 gap-4">
              <Input name="min_salary" value={form.min_salary} onChange={handleChange} placeholder="Lương tối thiểu" />
              <Input name="max_salary" value={form.max_salary} onChange={handleChange} placeholder="Lương tối đa" />
            </div>
          )}
        </FormSection>

        <button className="w-full bg-green-600 text-white py-3 rounded-full">
          Đăng tin tuyển dụng
        </button>
      </form>
    </div>
  );
}

/* ===== UI COMPONENTS ===== */
const FormSection = ({ title, children }) => (
  <section>
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="space-y-4">{children}</div>
  </section>
);

const Input = (props) => <input {...props} className="w-full border p-3 rounded-lg" />;
const Textarea = (props) => <textarea {...props} rows={4} className="w-full border p-3 rounded-lg" />;
const Select = ({ children, ...props }) => (
  <select {...props} className="w-full border p-3 rounded-lg">
    {children}
  </select>
);

export default CreateJobForm;
