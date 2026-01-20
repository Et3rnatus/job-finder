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
  const [errors, setErrors] = useState({});



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
   SALARY HELPERS
===================== */
const formatSalary = (value) => {
  const number = value.replace(/\D/g, "");
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseSalary = (value) =>
  value ? Number(value.replace(/\./g, "")) : null;

const handleSalaryChange = (e) => {
  setIsDirty(true);
  const raw = e.target.value.replace(/\./g, "");
  if (!/^\d*$/.test(raw)) return;

  setForm((p) => ({
    ...p,
    [e.target.name]: formatSalary(raw),
  }));
};

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

  setErrors((prev) => ({ ...prev, [name]: null }));
};


  const handleCityChange = (e) => {
    const cityId = e.target.value;
    const city = vnAddress.find((c) => c.Id === cityId);
    setForm((p) => ({ ...p, city: cityId, district: "" }));
    setDistricts(city ? city.Districts : []);
  };

const scrollToFirstError = (errors) => {
  const firstField = Object.keys(errors)[0];
  if (!firstField) return;

  const el = document.getElementById(firstField);
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: y, behavior: "smooth" });
    el.focus();
  }
};

  const toggleSalaryNegotiable = () => {
    setSalaryNegotiable((prev) => {
      const next = !prev;
      if (next) {
        setForm((p) => ({
          ...p,
          min_salary: "",
          max_salary: "",
        }));
      }
      return next;
    });
  };
  const isOtherCategory = () => {
  const selected = categories.find(
    (c) => c.id === form.category_id
  );
  return selected?.name === "Khác";
};

  const validateForm = () => {
  const newErrors = {};

  if (!form.title.trim()) {
    newErrors.title = "Vui lòng nhập tên công việc";
  }

  if (!form.category_id) {
    newErrors.category_id = "Vui lòng chọn ngành nghề";
  }

  if (
  !isOtherCategory() &&
  skills.length > 0 &&
  !form.skill_ids.length
) {
  newErrors.skill_ids = "Vui lòng chọn ít nhất 1 kỹ năng";
}


  if (!form.description.trim()) {
    newErrors.description = "Vui lòng nhập mô tả công việc";
  }

  if (!form.employment_type) {
    newErrors.employment_type = "Vui lòng chọn hình thức làm việc";
  }

  if (!salaryNegotiable) {
    const min = parseSalary(form.min_salary);
    const max = parseSalary(form.max_salary);

    if (!min) newErrors.min_salary = "Vui lòng nhập lương tối thiểu";
    if (!max) newErrors.max_salary = "Vui lòng nhập lương tối đa";
    if (min && max && min > max) {
      newErrors.max_salary = "Lương tối đa phải lớn hơn lương tối thiểu";
    }
  }

  if (
    form.preferred_age_min &&
    form.preferred_age_max &&
    Number(form.preferred_age_min) > Number(form.preferred_age_max)
  ) {
    newErrors.preferred_age_max = "Độ tuổi không hợp lệ";
  }

  setErrors(newErrors);

if (Object.keys(newErrors).length > 0) {
  scrollToFirstError(newErrors);
}

return Object.keys(newErrors).length === 0;
};

  /* =====================
     SUBMIT
  ===================== */
  const handleSubmit = async (e) => {
  e.preventDefault();
  setAlert(null);

  if (!validateForm()) return;

  // toàn bộ logic validate + submit cũ giữ nguyên phía 
    /* EMPLOYMENT TYPE */
if (!form.employment_type) {
  return setAlert({ type: "error", message: "Vui lòng chọn hình thức làm việc" });
}
    /* SALARY */
    if (!salaryNegotiable) {
  const min = parseSalary(form.min_salary);
  const max = parseSalary(form.max_salary);

  if (!min || !max) {
    return setAlert({ type: "error", message: "Vui lòng nhập mức lương hợp lệ" });
  }

  if (min < 1000000) {
    return setAlert({ type: "error", message: "Lương tối thiểu quá thấp" });
  }

  if (max > 200000000) {
    return setAlert({ type: "error", message: "Lương tối đa không hợp lý" });
  }

  if (min > max) {
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

        min_salary: salaryNegotiable ? null : parseSalary(form.min_salary),
max_salary: salaryNegotiable ? null : parseSalary(form.max_salary),
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
  id="title"
  name="title"
  value={form.title}
  onChange={handleChange}
  placeholder="Tên công việc *"
  maxLength={150}
/>

{errors.title && (
  <p className="text-sm text-red-600 mt-1">{errors.title}</p>
)}




          <Grid>
  <div className="space-y-1">
  <label className="text-sm text-gray-600">Hình thức làm việc</label>

    <Select
      id="employment_type"
      name="employment_type"
      value={form.employment_type}
      onChange={handleChange}
    >
      <option value="">Chọn hình thức</option>
      <option value="full_time">Toàn thời gian</option>
      <option value="part_time">Bán thời gian</option>
      <option value="internship">Thực tập</option>
    </Select>

    {errors.employment_type && (
      <p className="text-sm text-red-600 mt-1">
        {errors.employment_type}
      </p>
    )}

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
  {/* THỜI GIAN LÀM VIỆC */}
  <div className="space-y-1">
    <label className="text-sm text-gray-600">
      Thời gian làm việc
    </label>
    <Input
      name="working_time"
      value={form.working_time}
      onChange={handleChange}
      placeholder="VD: 8h00 – 17h00"
    />
    <p className="text-xs text-gray-400">
      Khung giờ làm việc trong ngày
    </p>
  </div>

  {/* NGÀY LÀM VIỆC */}
  <div className="space-y-1">
    <label className="text-sm text-gray-600">
      Ngày làm việc
    </label>
    <Input
      name="working_day"
      value={form.working_day}
      onChange={handleChange}
      placeholder="VD: Thứ 2 – Thứ 6"
    />
    <p className="text-xs text-gray-400">
      Các ngày làm việc trong tuần
    </p>
  </div>
</Grid>

          <Grid>
  <div className="space-y-1">
    <label className="text-sm text-gray-600">
      Số lượng tuyển
    </label>

    <Input
      id="hiring_quantity"
      type="number"
      min={1}
      name="hiring_quantity"
      value={form.hiring_quantity}
      onChange={handleChange}
      placeholder="VD: 5"
    />

    {errors.hiring_quantity && (
      <p className="text-sm text-red-600 mt-1">
        {errors.hiring_quantity}
      </p>
    )}

    <p className="text-xs text-gray-400">
      Số ứng viên cần tuyển cho vị trí này
    </p>
  </div>

  <div className="space-y-1">
    <label className="text-sm text-gray-600">
      Hạn nộp hồ sơ
    </label>

    <Input
      id="expired_at"
      type="date"
      min={new Date().toISOString().split("T")[0]}
      name="expired_at"
      value={form.expired_at}
      onChange={handleChange}
    />

    {errors.expired_at && (
      <p className="text-sm text-red-600 mt-1">
        {errors.expired_at}
      </p>
    )}

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
  <Select
    id="category_id"
    name="category_id"
    value={form.category_id}
    onChange={handleChange}
  >
    <option value="">Chọn ngành nghề *</option>
    {categories.map((c) => (
      <option key={c.id} value={c.id}>
        {c.name}
      </option>
    ))}
  </Select>

  {errors.category_id && (
    <p className="text-sm text-red-600 mt-1">
      {errors.category_id}
    </p>
  )}

  <p className="text-sm text-gray-400">
    Ngành nghề dùng để xác định kỹ năng yêu cầu bên dưới
  </p>
</Section>

{/* NOTE khi chọn ngành "Khác" */}
{isOtherCategory() && (
  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
    <p>
      Bạn đã chọn <span className="font-medium">ngành nghề Khác</span>.
    </p>
    <p className="mt-1">
      Với các vị trí phổ thông hoặc đặc thù (ví dụ: tài xế, bảo vệ, lao động phổ thông),
      hệ thống không yêu cầu kỹ năng cụ thể.
    </p>
    <p className="mt-1">
      Vui lòng mô tả chi tiết yêu cầu công việc ở phần mô tả & yêu cầu bên dưới.
    </p>
  </div>
)}

{/* SECTION KỸ NĂNG – CHỈ HIỆN KHI KHÔNG PHẢI "KHÁC" */}
{!isOtherCategory() && (
  <Section icon={<Wrench />} title="Kỹ năng yêu cầu">
    {/* Chưa chọn ngành */}
    {!form.category_id && (
      <p className="text-sm text-gray-400">
        Vui lòng chọn ngành nghề để hiển thị danh sách kỹ năng
      </p>
    )}

    {/* Ngành có nhưng chưa có skill */}
    {form.category_id && skills.length === 0 && (
      <p className="text-sm text-gray-400">
        Ngành nghề này chưa có kỹ năng cụ thể
      </p>
    )}

    {/* Danh sách kỹ năng */}
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
              onChange={(e) => {
                setIsDirty(true);
                setForm((p) => ({
                  ...p,
                  skill_ids: e.target.checked
                    ? [...p.skill_ids, s.id]
                    : p.skill_ids.filter((id) => id !== s.id),
                }));
                setErrors((prev) => ({ ...prev, skill_ids: null }));
              }}
            />
            {s.name}
          </label>
        ))}
      </div>
    )}

    {/* Lỗi validate */}
    {errors.skill_ids && (
      <p className="text-sm text-red-600 mt-2">
        {errors.skill_ids}
      </p>
    )}
  </Section>
)}
        <Section icon={<FileText />} title="Mô tả & yêu cầu">
  {/* MÔ TẢ CÔNG VIỆC */}
  <div className="space-y-1">
  <Textarea
    id="description"
    name="description"
    value={form.description}
    onChange={handleChange}
    placeholder={`Mô tả công việc chính, ví dụ:
- Thực hiện các công việc liên quan đến vị trí
- Phối hợp với các bộ phận liên quan
- Báo cáo tiến độ cho quản lý`}
  />

  {errors.description && (
    <p className="text-sm text-red-600 mt-1">
      {errors.description}
    </p>
  )}

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
            id="min_salary"
            name="min_salary"
            value={form.min_salary}
            onChange={handleSalaryChange}
          />

          {errors.min_salary && (
            <p className="text-sm text-red-600 mt-1">
              {errors.min_salary}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-600">
            Lương tối đa (VNĐ / tháng)
          </label>

          <Input
          id="max_salary"
            name="max_salary"
            value={form.max_salary}
            onChange={handleSalaryChange}
          />

          {errors.max_salary && (
            <p className="text-sm text-red-600 mt-1">
              {errors.max_salary}
            </p>
          )}
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
