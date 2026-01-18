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
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";  

export default function CreateJobForm() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [salaryNegotiable, setSalaryNegotiable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isDirty, setIsDirty] = useState(false);


  /* =====================
     FORM STATE
  ===================== */
  const [form, setForm] = useState({
    title: "",
    description: "",
    job_requirements: "",
    benefits: "",

    category_id: "",
    skill_ids: [],

    employment_type: "",
    experience: "no_experience",
    level: "staff",
    education_level: "university",

    working_day: "",
    working_time: "",

    hiring_quantity: "",
    expired_at: "",

    city: "",
    district: "",
    address_detail: "",

    min_salary: "",
    max_salary: "",
    application_language: "vi",

    preferred_gender: "any",
    preferred_age_min: "",
    preferred_age_max: "",
    preferred_nationality: "",
  });

  /* =====================
     LOAD DATA
  ===================== */
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (!form.category_id) {
      setSkills([]);
      setForm((p) => ({ ...p, skill_ids: [] }));
      return;
    }
    getSkillsByCategory(form.category_id).then(setSkills);
  }, [form.category_id]);

  useEffect(() => {
  const handleBeforeUnload = (e) => {
    if (!isDirty) return;
    e.preventDefault();
    e.returnValue = "";
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, [isDirty]);


  /* =====================
     HANDLERS
  ===================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setIsDirty(true);
    setForm((p) => ({
      ...p,
      [name]: name === "category_id" ? Number(value) : value,
    }));
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    const city = vnAddress.find((c) => c.Id === cityId);
    setForm((p) => ({ ...p, city: cityId, district: "" }));
    setDistricts(city ? city.Districts : []);
  };

  /* =====================
     SUBMIT
  ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    /* REQUIRED */
    if (!form.title || !form.category_id || !form.skill_ids.length || !form.description) {
      return setAlert({ type: "error", message: "Vui lòng nhập đầy đủ thông tin bắt buộc" });
    }
    /* EMPLOYMENT TYPE */
if (!form.employment_type) {
  return setAlert({ type: "error", message: "Vui lòng chọn hình thức làm việc" });
}


    /* SALARY */
    if (!salaryNegotiable) {
      if (!form.min_salary || !form.max_salary) {
        return setAlert({ type: "error", message: "Vui lòng nhập mức lương" });
      }
      if (Number(form.min_salary) > Number(form.max_salary)) {
        return setAlert({ type: "error", message: "Lương không hợp lệ" });
      }
    }

    /* EXPIRED DATE */
    if (form.expired_at) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expiredDate = new Date(form.expired_at);
      if (expiredDate <= today) {
        return setAlert({ type: "error", message: "Hạn nộp phải lớn hơn hôm nay" });
      }
    }

    /* AGE VALIDATE */
    if (
      form.preferred_age_min &&
      form.preferred_age_max &&
      Number(form.preferred_age_min) > Number(form.preferred_age_max)
    ) {
      return setAlert({ type: "error", message: "Độ tuổi không hợp lệ" });
    }

    let location = null;
    if (form.city && form.district && form.address_detail) {
      const cityName = vnAddress.find((c) => c.Id === form.city)?.Name || "";
      const districtName = districts.find((d) => d.Id === form.district)?.Name || "";
      location = `${form.address_detail}, ${districtName}, ${cityName}`;
    }

    try {
      setLoading(true);

      await createJob({
        title: form.title,
        description: form.description,
        job_requirements: form.job_requirements,
        benefits: form.benefits,

        category_id: form.category_id,
        skill_ids: form.skill_ids,

        employment_type: form.employment_type,
        experience: form.experience,
        level: form.level,
        education_level: form.education_level,

        working_day: form.working_day,
        working_time: form.working_time,

        hiring_quantity: Number(form.hiring_quantity) || null,
        expired_at: form.expired_at || null,

        location,
        address: form.address_detail,

        min_salary: salaryNegotiable ? null : Number(form.min_salary),
        max_salary: salaryNegotiable ? null : Number(form.max_salary),
        is_salary_negotiable: salaryNegotiable ? 1 : 0,

        application_language: form.application_language,
        preferred_gender: form.preferred_gender,
        preferred_age_min: form.preferred_age_min ? Number(form.preferred_age_min) : null,
        preferred_age_max: form.preferred_age_max ? Number(form.preferred_age_max) : null,
        preferred_nationality: form.preferred_nationality || null,
      });
      setAlert({ type: "success" });
    } catch {
      setAlert({ type: "error", message: "Đăng tin thất bại" });
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     SUCCESS
  ===================== */
  if (alert?.type === "success") {
    return (
      <div className="bg-white border rounded-3xl p-20 text-center">
        <CheckCircle2 size={56} className="mx-auto text-emerald-600 mb-4" />
        <h2 className="text-2xl font-semibold">Đăng tin thành công</h2>
        <button
          onClick={() => {
    setIsDirty(false);
    navigate("/account/employer");
  }}
          className="mt-6 px-10 py-3 bg-emerald-600 text-white rounded-full"
        >
          Về trang quản lý
        </button>
      </div>
    );
  }

  /* =====================
     RENDER
  ===================== */
  return (
    <div className="bg-white border rounded-3xl p-12 max-w-6xl mx-auto">
      <h2 className="text-3xl font-semibold mb-12">Đăng tin tuyển dụng</h2>

      <form onSubmit={handleSubmit} className="space-y-14">
        <Section icon={<Briefcase />} title="Thông tin công việc">
          <Input
  name="title"
  value={form.title}
  onChange={handleChange}
  placeholder="Tên công việc *"
  maxLength={150}
/>


          <Grid>
  <div className="space-y-1">
  <label className="text-sm text-gray-600">Hình thức làm việc</label>
  <Select
    name="employment_type"
    value={form.employment_type}
    onChange={handleChange}
  >
    <option value="">Chọn hình thức</option>
    <option value="full_time">Toàn thời gian</option>
    <option value="part_time">Bán thời gian</option>
    <option value="internship">Thực tập</option>
  </Select>
  <p className="text-xs text-gray-400">
    Giúp ứng viên biết thời gian và cách làm việc của vị trí này
  </p>
</div>


  <div className="space-y-1">
    <label className="text-sm text-gray-600">Kinh nghiệm yêu cầu</label>
    <Select name="experience" value={form.experience} onChange={handleChange}>
      <option value="no_experience">Không yêu cầu kinh nghiệm</option>
      <option value="under_1_year">Dưới 1 năm</option>
      <option value="1_year">1 năm</option>
      <option value="2_3_years">2–3 năm</option>
      <option value="3_5_years">3–5 năm</option>
      <option value="over_5_years">Trên 5 năm</option>
    </Select>
  </div>
</Grid>

          <Grid>
  <div className="space-y-1">
    <label className="text-sm text-gray-600">Cấp bậc</label>
    <Select name="level" value={form.level} onChange={handleChange}>
      <option value="intern">Thực tập</option>
      <option value="staff">Nhân viên</option>
      <option value="senior">Senior</option>
      <option value="leader">Leader</option>
      <option value="manager">Quản lý</option>
    </Select>
  </div>

  <div className="space-y-1">
    <label className="text-sm text-gray-600">Trình độ học vấn</label>
    <Select name="education_level" value={form.education_level} onChange={handleChange}>
      <option value="high_school">THPT</option>
      <option value="college">Cao đẳng</option>
      <option value="university">Đại học</option>
      <option value="master">Thạc sĩ</option>
      <option value="phd">Tiến sĩ</option>
    </Select>
  </div>
</Grid>


          <Grid>
  <div className="space-y-1">
  <label className="text-sm text-gray-600">
    Số lượng tuyển
  </label>
  <Input
    type="number"
    min={1}
    name="hiring_quantity"
    value={form.hiring_quantity}
    onChange={handleChange}
    placeholder="VD: 5"
  />
  <p className="text-xs text-gray-400">
    Số ứng viên cần tuyển cho vị trí này
  </p>
</div>


  <div className="space-y-1">
  <label className="text-sm text-gray-600">
    Hạn nộp hồ sơ
  </label>
  <Input
    type="date"
    min={new Date().toISOString().split("T")[0]}
    name="expired_at"
    value={form.expired_at}
    onChange={handleChange}
  />
  <p className="text-xs text-gray-400">
    Sau ngày này, tin tuyển dụng sẽ không nhận hồ sơ mới
  </p>
</div>
</Grid>



          <div className="space-y-1">
  <label className="text-sm text-gray-600">
    Ngôn ngữ nhận hồ sơ
  </label>

  <Select
    name="application_language"
    value={form.application_language}
    onChange={handleChange}
  >
    <option value="vi">Tiếng Việt</option>
    <option value="en">English</option>
    <option value="vi_en">Việt & English (song ngữ)</option>
  </Select>

  <p className="text-xs text-gray-400">
    Ứng viên sẽ nộp CV và hồ sơ bằng ngôn ngữ này
  </p>
</div>

        </Section>

        <Section icon={<Layers />} title="Ngành nghề">
  <Select name="category_id" value={form.category_id} onChange={handleChange}>
    <option value="">Chọn ngành nghề *</option>
    {categories.map((c) => (
      <option key={c.id} value={c.id}>{c.name}</option>
    ))}
  </Select>

  <p className="text-sm text-gray-400">
    Ngành nghề dùng để xác định kỹ năng yêu cầu bên dưới
  </p>
</Section>


        <Section icon={<Wrench />} title="Kỹ năng yêu cầu">
  {!form.category_id && (
    <p className="text-sm text-gray-400">
      Vui lòng chọn ngành nghề để hiển thị danh sách kỹ năng
    </p>
  )}

  {form.category_id && skills.length === 0 && (
    <p className="text-sm text-gray-400">
      Ngành nghề này chưa có kỹ năng cụ thể
    </p>
  )}

  {skills.length > 0 && (
    <div className="flex flex-wrap gap-3">
      {skills.map((s) => (
        <label
          key={s.id}
          className={`px-4 py-2 rounded-full border cursor-pointer ${
            form.skill_ids.includes(s.id)
              ? "bg-emerald-600 text-white"
              : ""
          }`}
        >
          <input
            type="checkbox"
            hidden
            checked={form.skill_ids.includes(s.id)}
            onChange={(e) =>{
              setIsDirty(true);
              setForm((p) => ({
                ...p,
                skill_ids: e.target.checked
                  ? [...p.skill_ids, s.id]
                  : p.skill_ids.filter((id) => id !== s.id),
              }))
            }}
          />
          {s.name}
        </label>
      ))}
    </div>
  )}
</Section>
        <Section icon={<FileText />} title="Mô tả & yêu cầu">
  {/* MÔ TẢ CÔNG VIỆC */}
  <div className="space-y-1">
    <Textarea
      name="description"
      value={form.description}
      onChange={handleChange}
      placeholder={`Mô tả công việc chính, ví dụ:
- Thực hiện các công việc liên quan đến vị trí
- Phối hợp với các bộ phận liên quan
- Báo cáo tiến độ cho quản lý`}
    />
    <p className="text-xs text-gray-400">
      Mô tả rõ nhiệm vụ để ứng viên hiểu công việc sẽ làm
    </p>
  </div>

  {/* YÊU CẦU ỨNG VIÊN */}
  <div className="space-y-1">
    <Textarea
      name="job_requirements"
      value={form.job_requirements}
      onChange={handleChange}
      placeholder={`Yêu cầu ứng viên, ví dụ:
- Có kinh nghiệm liên quan
- Có kỹ năng phù hợp với công việc
- Có tinh thần trách nhiệm`}
    />
    <p className="text-xs text-gray-400">
      Chỉ cần nêu các yêu cầu quan trọng, không bắt buộc ghi quá chi tiết
    </p>
  </div>
</Section>

<Section icon={<Gift />} title="Quyền lợi">
  <div className="space-y-1">
    <Textarea
      name="benefits"
      value={form.benefits}
      onChange={handleChange}
      maxLength={255}
      placeholder={`Quyền lợi khi làm việc, ví dụ:
- Lương, thưởng theo năng lực
- Môi trường làm việc thân thiện
- Được đào tạo, phát triển kỹ năng`}
    />
    <p className="text-xs text-gray-400">
      Tối đa 255 ký tự – chỉ cần nêu những quyền lợi nổi bật
    </p>
  </div>
</Section>


        <Section icon={<Banknote />} title="Mức lương">
  <div className="space-y-2">
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={salaryNegotiable}
        onChange={() => setSalaryNegotiable(!salaryNegotiable)}
      />
      <span className="font-medium">Lương thỏa thuận</span>
    </label>

    <p className="text-sm text-gray-400">
      Nếu bật, ứng viên sẽ thấy “Lương thỏa thuận”
    </p>
  </div>

  {!salaryNegotiable && (
    <div className="space-y-2">
      <Grid>
        <div className="space-y-1">
          <label className="text-sm text-gray-600">
            Lương tối thiểu (VNĐ / tháng)
          </label>
          <Input
            type="number"
            min={0}
            step={100000}
            name="min_salary"
            value={form.min_salary}
            onChange={handleChange}
            placeholder="VD: 8.000.000"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-600">
            Lương tối đa (VNĐ / tháng)
          </label>
          <Input
            type="number"
            min={0}
            step={100000}
            name="max_salary"
            value={form.max_salary}
            onChange={handleChange}
            placeholder="VD: 12.000.000"
          />
        </div>
      </Grid>

      <p className="text-xs text-gray-400">
        Ứng viên sẽ thấy mức lương theo khoảng bạn nhập
      </p>
    </div>
  )}
</Section>


        <Section icon={<AlertTriangle />} title="Điều kiện ưu tiên (không bắt buộc)">
  {/* Giới tính */}
  <div className="space-y-1">
    <label className="text-sm text-gray-600">Giới tính</label>
    <Select
      name="preferred_gender"
      value={form.preferred_gender}
      onChange={handleChange}
    >
      <option value="any">Không yêu cầu</option>
      <option value="male">Nam</option>
      <option value="female">Nữ</option>
    </Select>
  </div>

  {/* Độ tuổi */}
  <div className="space-y-1">
    <label className="text-sm text-gray-600">Độ tuổi (nếu có)</label>
    <Grid>
      <Input
        type="number"
        min={16}
        max={65}
        name="preferred_age_min"
        value={form.preferred_age_min}
        onChange={handleChange}
        placeholder="Từ"
      />
      <Input
        type="number"
        min={16}
        max={65}
        name="preferred_age_max"
        value={form.preferred_age_max}
        onChange={handleChange}
        placeholder="Đến"
      />
    </Grid>
    <p className="text-xs text-gray-400">
      Bỏ trống nếu không yêu cầu độ tuổi
    </p>
  </div>

  {/* Quốc tịch */}
  <div className="space-y-1">
    <label className="text-sm text-gray-600">Quốc tịch</label>
    <Select
      name="preferred_nationality"
      value={form.preferred_nationality}
      onChange={handleChange}
    >
      <option value="">Không yêu cầu</option>
      <option value="vn">Việt Nam</option>
      <option value="foreign">Người nước ngoài</option>
    </Select>
  </div>
</Section>


        {alert?.type === "error" && (
          <div className="flex gap-2 text-red-600 bg-red-50 p-4 rounded-xl">
            <AlertTriangle size={16} />
            {alert.message}
          </div>
        )}

        <button
  disabled={loading}
  className={`w-full py-4 rounded-full text-lg font-semibold flex items-center justify-center gap-2
    ${loading
      ? "bg-emerald-400 cursor-not-allowed"
      : "bg-emerald-600 hover:bg-emerald-700"
    }
    text-white transition
  `}
>
  {loading ? (
    <>
      <Loader2 className="animate-spin" size={20} />
      <span>Đang đăng tin...</span>
    </>
  ) : (
    "Đăng tin tuyển dụng"
  )}
</button>
      </form>
    </div>
  );
}

/* =====================
   UI HELPERS
===================== */
const Section = ({ icon, title, children }) => (
  <section>
    <div className="flex items-center gap-2 mb-5">
      {icon}
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);

const Grid = ({ children }) => <div className="grid md:grid-cols-2 gap-4">{children}</div>;

const Input = (props) => (
  <input {...props} className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-emerald-500" />
);

const Textarea = (props) => (
  <textarea {...props} rows={5} className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-emerald-500" />
);

const Select = ({ children, ...props }) => (
  <select {...props} className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-emerald-500">
    {children}
  </select>
);
