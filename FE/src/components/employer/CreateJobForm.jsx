import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import vnAddress from "../../data/vn-address.json";
import { createJob } from "../../services/jobService";
import { getSkillsByCategory } from "../../services/skillService";
import { getCategories } from "../../services/categoryService";
import {
  Briefcase,
  Layers,
  Wrench,
  FileText,
  Gift,
  Banknote,
  MapPin,
  CheckCircle2,
} from "lucide-react";

export default function CreateJobForm() {
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

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (!form.category_id) {
      setSkills([]);
      setForm((p) => ({ ...p, skill_ids: [] }));
      return;
    }
    setForm((p) => ({ ...p, skill_ids: [] }));
    getSkillsByCategory(form.category_id).then(setSkills);
  }, [form.category_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: name === "category_id" ? Number(value) : value,
    }));
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    const cityData = vnAddress.find((c) => c.Id === cityId);
    setForm((p) => ({ ...p, city: cityId, district: "" }));
    setDistricts(cityData ? cityData.Districts : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let location = null;
    if (form.city && form.district && form.address_detail) {
      const cityName =
        vnAddress.find((c) => c.Id === form.city)?.Name || "";
      const districtName =
        districts.find((d) => d.Id === form.district)?.Name || "";
      location = `${form.address_detail}, ${districtName}, ${cityName}`;
    }

    await createJob({
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
    });

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="bg-white border border-gray-200 rounded-3xl p-20 text-center shadow-sm">
        <CheckCircle2 size={56} className="mx-auto text-emerald-600 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">
          Đăng tin thành công
        </h2>
        <p className="text-gray-500 mb-8">
          Tin tuyển dụng đang chờ admin duyệt
        </p>
        <button
          onClick={() => navigate("/account/employer")}
          className="px-10 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
        >
          Về trang quản lý
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-12 shadow-sm max-w-6xl mx-auto">
      <h2 className="text-3xl font-semibold mb-12">
        Đăng tin tuyển dụng
      </h2>

      <form onSubmit={handleSubmit} className="space-y-14">
        <Section icon={<Briefcase />} title="Thông tin công việc">
          <Input name="title" value={form.title} onChange={handleChange} placeholder="Tên công việc" />
          <Grid>
            <Select name="employment_type" value={form.employment_type} onChange={handleChange}>
              <option value="">Hình thức làm việc</option>
              <option value="fulltime">Toàn thời gian</option>
              <option value="parttime">Bán thời gian</option>
              <option value="intern">Thực tập</option>
            </Select>
            <Select name="experience" value={form.experience} onChange={handleChange}>
              <option value="">Kinh nghiệm</option>
              <option value="no_experience">Không yêu cầu</option>
              <option value="under_1_year">Dưới 1 năm</option>
              <option value="1_year">1 năm</option>
              <option value="2_3_years">2–3 năm</option>
              <option value="over_3_years">Trên 3 năm</option>
            </Select>
          </Grid>
          <Grid>
            <Input type="number" name="hiring_quantity" value={form.hiring_quantity} onChange={handleChange} placeholder="Số lượng tuyển" />
            <Input type="date" name="expired_at" value={form.expired_at} onChange={handleChange} />
          </Grid>
        </Section>

        <Section icon={<Layers />} title="Ngành nghề">
          <Select name="category_id" value={form.category_id} onChange={handleChange}>
            <option value="">Chọn ngành nghề</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </Section>

        <Section icon={<Wrench />} title="Kỹ năng yêu cầu">
          <div className="flex flex-wrap gap-3">
            {skills.map((s) => (
              <label
                key={s.id}
                className={`px-4 py-2 rounded-full text-sm border cursor-pointer transition ${
                  form.skill_ids.includes(s.id)
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-gray-50 hover:bg-emerald-50"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={form.skill_ids.includes(s.id)}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      skill_ids: e.target.checked
                        ? [...p.skill_ids, s.id]
                        : p.skill_ids.filter((id) => id !== s.id),
                    }))
                  }
                />
                {s.name}
              </label>
            ))}
          </div>
        </Section>

        <Section icon={<FileText />} title="Mô tả & yêu cầu">
          <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Mô tả công việc" />
          <Textarea name="job_requirements" value={form.job_requirements} onChange={handleChange} placeholder="Yêu cầu ứng viên" />
        </Section>

        <Section icon={<Gift />} title="Quyền lợi">
          <Textarea name="benefits" value={form.benefits} onChange={handleChange} placeholder="Quyền lợi" />
        </Section>

        <Section icon={<Banknote />} title="Mức lương">
          <label className="inline-flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={salaryNegotiable}
              onChange={() => setSalaryNegotiable(!salaryNegotiable)}
            />
            Lương thỏa thuận
          </label>

          {!salaryNegotiable && (
            <Grid>
              <Input name="min_salary" value={form.min_salary} onChange={handleChange} placeholder="Lương tối thiểu" />
              <Input name="max_salary" value={form.max_salary} onChange={handleChange} placeholder="Lương tối đa" />
            </Grid>
          )}
        </Section>

        <button className="w-full py-4 rounded-full bg-emerald-600 text-white text-lg font-semibold hover:bg-emerald-700 transition">
          Đăng tin tuyển dụng
        </button>
      </form>
    </div>
  );
}

/* UI */
const Section = ({ icon, title, children }) => (
  <section>
    <div className="flex items-center gap-2 mb-5 text-gray-800">
      {icon}
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);

const Grid = ({ children }) => (
  <div className="grid md:grid-cols-2 gap-4">{children}</div>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500"
  />
);

const Textarea = (props) => (
  <textarea
    {...props}
    rows={5}
    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500"
  />
);

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-emerald-500"
  >
    {children}
  </select>
);
