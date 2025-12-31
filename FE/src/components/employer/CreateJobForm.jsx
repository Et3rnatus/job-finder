import { useEffect, useState } from "react";
import vnAddress from "../../data/vn-address.json";
import { createJob } from "../../services/jobService";
import { getSkills } from "../../services/skillService";

function CreateJobForm() {
  const [useCompanyAddress, setUseCompanyAddress] = useState(true);
  const [districts, setDistricts] = useState([]);
  const [salaryNegotiable, setSalaryNegotiable] = useState(true);

  const [skills, setSkills] = useState([]);

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
    hiring_quantity: "",
    expired_at: "",

    skill_ids: [],
  });

  /* ================= LOAD SKILLS ================= */
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await getSkills();
        setSkills(data);
      } catch (err) {
        console.error("LOAD SKILLS ERROR", err);
        alert("Không thể tải danh sách kỹ năng");
      }
    };

    loadSkills();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ===== FE VALIDATE (KHỚP BE) =====
    if (
      !form.title ||
      !form.description ||
      !form.job_requirements ||
      !form.benefits ||
      !form.employment_type ||
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

    // ===== LOCATION =====
    // FE chỉ build location khi KHÔNG dùng địa chỉ công ty
    let location = "";

    if (!useCompanyAddress) {
      if (!form.city || !form.district || !form.address_detail) {
        alert("Vui lòng nhập đầy đủ địa chỉ làm việc");
        return;
      }

      const cityName =
        vnAddress.find((c) => c.Id === form.city)?.Name || "";

      const districtName =
        districts.find((d) => d.Id === form.district)?.Name || "";

      location = `${form.address_detail}, ${districtName}, ${cityName}`;
    }
    // Nếu useCompanyAddress = true → location để rỗng
    // BE sẽ tự lấy employer.address

    // ===== SALARY CHECK =====
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

      location, // có thể là "" → BE xử lý

      employment_type: form.employment_type,
      hiring_quantity: Number(form.hiring_quantity),
      expired_at: form.expired_at,

      min_salary: salaryNegotiable ? null : Number(form.min_salary),
      max_salary: salaryNegotiable ? null : Number(form.max_salary),
      is_salary_negotiable: salaryNegotiable ? 1 : 0,

      category_id: null,
      skill_ids: form.skill_ids,
    };

    try {
      await createJob(payload);
      alert("Tạo tin tuyển dụng thành công");
    } catch (err) {
      console.error("CREATE JOB ERROR 👉", err);
      alert(err.response?.data?.message || "Tạo tin thất bại");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Đăng tin tuyển dụng
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ===== THÔNG TIN CÔNG VIỆC ===== */}
        <section>
          <h3 className="font-semibold mb-3">Thông tin công việc</h3>

          <input
            name="title"
            placeholder="Tên công việc"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-3 rounded mb-3"
          />

          <select
            name="employment_type"
            value={form.employment_type}
            onChange={handleChange}
            className="w-full border p-3 rounded mb-3"
          >
            <option value="">Chọn hình thức làm việc</option>
            <option value="fulltime">Full-time</option>
            <option value="parttime">Part-time</option>
            <option value="intern">Thực tập</option>
          </select>

          <input
            name="hiring_quantity"
            type="number"
            min={1}
            placeholder="Số lượng tuyển"
            value={form.hiring_quantity}
            onChange={handleChange}
            className="w-full border p-3 rounded mb-3"
          />

          <input
            name="expired_at"
            type="date"
            value={form.expired_at}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
        </section>

        {/* ===== ĐỊA ĐIỂM ===== */}
        <section>
          <h3 className="font-semibold mb-3">Địa điểm làm việc</h3>

          <div className="flex gap-6 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={useCompanyAddress}
                onChange={() => setUseCompanyAddress(true)}
              />
              Sử dụng địa chỉ công ty
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={!useCompanyAddress}
                onChange={() => setUseCompanyAddress(false)}
              />
              Nhập địa chỉ khác
            </label>
          </div>

          {!useCompanyAddress && (
            <div className="space-y-3">
              <select
                value={form.city}
                onChange={handleCityChange}
                className="w-full border p-3 rounded"
              >
                <option value="">Chọn tỉnh / thành phố</option>
                {vnAddress.map((c) => (
                  <option key={c.Id} value={c.Id}>
                    {c.Name}
                  </option>
                ))}
              </select>

              <select
                name="district"
                value={form.district}
                onChange={handleChange}
                disabled={!form.city}
                className="w-full border p-3 rounded"
              >
                <option value="">Chọn quận / huyện</option>
                {districts.map((d) => (
                  <option key={d.Id} value={d.Id}>
                    {d.Name}
                  </option>
                ))}
              </select>

              <input
                name="address_detail"
                placeholder="Số nhà, tên đường"
                value={form.address_detail}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />
            </div>
          )}
        </section>

        {/* ===== MÔ TẢ & YÊU CẦU ===== */}
        <section>
          <h3 className="font-semibold mb-3">Mô tả & yêu cầu</h3>

          <textarea
            name="description"
            placeholder="Mô tả công việc"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full border p-3 rounded mb-3"
          />

          <textarea
            name="job_requirements"
            placeholder="Yêu cầu ứng viên"
            value={form.job_requirements}
            onChange={handleChange}
            rows="4"
            className="w-full border p-3 rounded"
          />
        </section>

        {/* ===== KỸ NĂNG ===== */}
        <section>
          <h3 className="font-semibold mb-3">Kỹ năng yêu cầu</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {skills.map((skill) => (
              <label key={skill.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={skill.id}
                  checked={form.skill_ids.includes(skill.id)}
                  onChange={(e) => {
                    const skillId = Number(e.target.value);

                    setForm((prev) => ({
                      ...prev,
                      skill_ids: e.target.checked
                        ? [...prev.skill_ids, skillId]
                        : prev.skill_ids.filter((id) => id !== skillId),
                    }));
                  }}
                />
                {skill.name}
              </label>
            ))}
          </div>
        </section>

        {/* ===== QUYỀN LỢI ===== */}
        <section>
          <h3 className="font-semibold mb-3">Quyền lợi</h3>

          <textarea
            name="benefits"
            placeholder="Quyền lợi dành cho ứng viên"
            value={form.benefits}
            onChange={handleChange}
            rows="3"
            className="w-full border p-3 rounded"
          />
        </section>

        {/* ===== LƯƠNG ===== */}
        <section>
          <h3 className="font-semibold mb-3">Mức lương</h3>

          <div className="flex gap-6 mb-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={salaryNegotiable}
                onChange={() => setSalaryNegotiable(true)}
              />
              Thỏa thuận
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={!salaryNegotiable}
                onChange={() => setSalaryNegotiable(false)}
              />
              Nhập mức lương
            </label>
          </div>

          {!salaryNegotiable && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="min_salary"
                placeholder="Lương tối thiểu (VNĐ)"
                value={form.min_salary}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />
              <input
                name="max_salary"
                placeholder="Lương tối đa (VNĐ)"
                value={form.max_salary}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />
            </div>
          )}
        </section>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 font-medium"
        >
          Đăng tin tuyển dụng
        </button>
      </form>
    </div>
  );
}

export default CreateJobForm;
