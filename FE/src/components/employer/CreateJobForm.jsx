import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import vnAddress from "../../data/vn-address.json";
import { createJob } from "../../services/jobService";
import { getSkills } from "../../services/skillService";
import { getCategories } from "../../services/categoryService";

function CreateJobForm() {
  const navigate = useNavigate();

  const [useCompanyAddress, setUseCompanyAddress] = useState(true);
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
    level: "",                 // ✅ NEW
    education_level: "",       // ✅ NEW
    hiring_quantity: "",
    expired_at: "",

    skill_ids: [],
    category_ids: [],
  });

  /* =====================
     LOAD SKILLS + CATEGORIES
  ===================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [skillData, categoryData] = await Promise.all([
          getSkills(),
          getCategories(),
        ]);

        setSkills(skillData);
        setCategories(categoryData);
      } catch {
        alert("Không thể tải dữ liệu kỹ năng / ngành nghề");
      }
    };

    loadData();
  }, []);

  /* =====================
     HANDLERS
  ===================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* =====================
     SUBMIT
  ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.description ||
      !form.job_requirements ||
      !form.benefits ||
      !form.employment_type ||
      !form.experience ||
      !form.level ||                 // ✅ REQUIRED
      !form.education_level ||       // ✅ REQUIRED
      !form.hiring_quantity ||
      !form.expired_at
    ) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    if (form.skill_ids.length === 0) {
      alert("Vui lòng chọn ít nhất 1 kỹ năng");
      return;
    }

    if (form.category_ids.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ngành nghề");
      return;
    }

    if (
      !salaryNegotiable &&
      Number(form.min_salary) > Number(form.max_salary)
    ) {
      alert("Lương tối thiểu không được lớn hơn lương tối đa");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      job_requirements: form.job_requirements,
      benefits: form.benefits,
      employment_type: form.employment_type,
      experience: form.experience,
      level: form.level,                       // ✅ SEND
      education_level: form.education_level,   // ✅ SEND
      hiring_quantity: Number(form.hiring_quantity),
      expired_at: form.expired_at,
      min_salary: salaryNegotiable ? null : Number(form.min_salary),
      max_salary: salaryNegotiable ? null : Number(form.max_salary),
      is_salary_negotiable: salaryNegotiable ? 1 : 0,
      skill_ids: form.skill_ids,
      category_ids: form.category_ids,
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
          className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700"
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
      <h2 className="text-2xl font-semibold mb-8">
        Đăng tin tuyển dụng
      </h2>

      <form onSubmit={handleSubmit} className="space-y-10">
        <FormSection title="Thông tin công việc">
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Tên công việc"
          />

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
            <option value="3_5_years">3–5 năm</option>
            <option value="over_5_years">Trên 5 năm</option>
          </Select>

          <Select name="level" value={form.level} onChange={handleChange}>
            <option value="">Cấp bậc</option>
            <option value="intern">Thực tập sinh</option>
            <option value="staff">Nhân viên</option>
            <option value="senior">Senior</option>
            <option value="leader">Trưởng nhóm</option>
            <option value="manager">Quản lý</option>
          </Select>

          <Select
            name="education_level"
            value={form.education_level}
            onChange={handleChange}
          >
            <option value="">Học vấn</option>
            <option value="high_school">THPT</option>
            <option value="college">Cao đẳng</option>
            <option value="university">Đại học trở lên</option>
            <option value="master">Thạc sĩ</option>
            <option value="phd">Tiến sĩ</option>
          </Select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="hiring_quantity"
              type="number"
              min={1}
              value={form.hiring_quantity}
              onChange={handleChange}
              placeholder="Số lượng tuyển"
            />
            <Input
              name="expired_at"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={form.expired_at}
              onChange={handleChange}
            />
          </div>
        </FormSection>

        <button className="w-full bg-green-600 text-white py-3 rounded-full hover:bg-green-700 font-medium">
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

const Input = (props) => (
  <input {...props} className="w-full border p-3 rounded-lg" />
);

const Select = ({ children, ...props }) => (
  <select {...props} className="w-full border p-3 rounded-lg">
    {children}
  </select>
);

export default CreateJobForm;
