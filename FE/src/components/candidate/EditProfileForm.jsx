import { useEffect, useState } from "react";
import candidateService from "../../services/candidateService";
import axios from "axios";
import {
  User,
  Calendar,
  Wrench,
  GraduationCap,
  Briefcase,
  Plus,
  Trash2,
  Save,
  X,
} from "lucide-react";

/* ================= SKILL GROUPS (FE ONLY) ================= */
const SKILL_GROUPS = {
  technical: {
    title: "🔧 Kỹ năng chuyên môn",
    match: [
      "JavaScript",
      "ReactJS",
      "NodeJS",
      "HTML",
      "CSS",
      "Java",
      "MySQL",
      "PostgreSQL",
      "REST API",
    ],
  },
  tool: {
    title: "🛠 Công cụ & nền tảng",
    match: ["Git", "Excel"],
  },
  marketing: {
    title: "📊 Marketing / Kinh doanh",
    match: [
      "Digital Marketing",
      "SEO",
      "Facebook Ads",
      "Google Ads",
      "Bán hàng",
      "Content Marketing",
    ],
  },
  business: {
    title: "📁 Nghiệp vụ / Quản lý",
    match: [
      "Kế toán tổng hợp",
      "Kiểm toán",
      "Thuế",
      "Quản lý sản xuất",
      "Lập báo cáo tài chính",
      "Kiểm soát chất lượng",
    ],
  },
  soft: {
    title: "🤝 Kỹ năng mềm",
    match: [
      "Giao tiếp",
      "Làm việc nhóm",
      "Quản lý thời gian",
      "Đàm phán",
      "Chăm sóc khách hàng",
    ],
  },
};

function EditProfileForm({ profile, onUpdated, onCancel }) {
  const [form, setForm] = useState({
    full_name: "",
    contact_number: "",
    address: "",
    bio: "",
    gender: "",
    date_of_birth: "",
    skills: [],
    education: [],
    experiences: [],
  });

  const [allSkills, setAllSkills] = useState([]);
  const [saving, setSaving] = useState(false);

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    if (!profile) return;

    setForm({
      full_name: profile.full_name || "",
      contact_number: profile.contact_number || "",
      address: profile.address || "",
      bio: profile.bio || "",
      gender: profile.gender || "",
      date_of_birth: profile.date_of_birth
        ? profile.date_of_birth.slice(0, 10)
        : "",
      skills: Array.isArray(profile.skills)
        ? profile.skills.map((s) => s.id)
        : [],
      education: profile.education || [],
      experiences: profile.experiences || [],
    });
  }, [profile]);

  /* ================= LOAD SKILLS ================= */
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:3001/api/skills");
        setAllSkills(res.data);
      } catch (err) {
        console.error("LOAD SKILLS ERROR:", err);
      }
    };
    loadSkills();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SKILLS ================= */
  const toggleSkill = (skillId) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter((id) => id !== skillId)
        : [...prev.skills, skillId],
    }));
  };

  /* ================= EDUCATION ================= */
  const addEducation = () => {
    setForm((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { level: "", institution: "", major: "", status: "" },
      ],
    }));
  };

  const updateEducation = (index, field, value) => {
    const updated = [...form.education];
    updated[index][field] = value;
    setForm({ ...form, education: updated });
  };

  const removeEducation = (index) => {
    setForm({
      ...form,
      education: form.education.filter((_, i) => i !== index),
    });
  };

  /* ================= EXPERIENCE ================= */
  const addExperience = () => {
    setForm((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { company: "", position: "", description: "" },
      ],
    }));
  };

  const updateExperience = (index, field, value) => {
    const updated = [...form.experiences];
    updated[index][field] = value;
    setForm({ ...form, experiences: updated });
  };

  const removeExperience = (index) => {
    setForm({
      ...form,
      experiences: form.experiences.filter((_, i) => i !== index),
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.full_name || !form.contact_number || !form.date_of_birth) {
      alert("Vui lòng nhập đầy đủ họ tên, số điện thoại và ngày sinh");
      return;
    }

    if (!form.skills.length) {
      alert("Vui lòng chọn ít nhất một kỹ năng");
      return;
    }

    try {
      setSaving(true);
      await candidateService.updateProfile({
        ...form,
        date_of_birth: form.date_of_birth || null,
      });
      alert("Cập nhật hồ sơ thành công");
      onUpdated();
    } catch (err) {
      alert(err.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white border rounded-2xl shadow-sm p-8">
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Hồ sơ ứng viên
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Bạn có thể cập nhật hồ sơ bất kỳ lúc nào
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* ================= PERSONAL INFO ================= */}
        <Section icon={<User size={18} />} title="Thông tin cá nhân">
          <Grid>
            <Input label="Họ và tên *" name="full_name" value={form.full_name} onChange={handleChange} />
            <Input label="Số điện thoại *" name="contact_number" value={form.contact_number} onChange={handleChange} />
            <Input label="Email" value={profile.email || ""} disabled />
            <Input label="Địa chỉ" name="address" value={form.address} onChange={handleChange} />
          </Grid>

          <Textarea
            label="Giới thiệu bản thân"
            name="bio"
            value={form.bio}
            onChange={handleChange}
          />

          <Grid>
            <Select
              label="Giới tính"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              options={[
                { value: "", label: "-- Chọn --" },
                { value: "Nam", label: "Nam" },
                { value: "Nữ", label: "Nữ" },
                { value: "Khác", label: "Khác" },
              ]}
            />
            <Input
              label="Ngày sinh *"
              type="date"
              name="date_of_birth"
              value={form.date_of_birth}
              onChange={handleChange}
              icon={<Calendar size={16} />}
            />
          </Grid>
        </Section>

        {/* ================= SKILLS (FIXED) ================= */}
        <Section icon={<Wrench size={18} />} title="Kỹ năng">
          <p className="text-sm text-gray-500 mb-4">
            Chỉ chọn những kỹ năng bạn thực sự thành thạo
          </p>

          {Object.values(SKILL_GROUPS).map((group) => {
            const skills = allSkills.filter((s) =>
              group.match.includes(s.name)
            );

            if (!skills.length) return null;

            return (
              <div key={group.title} className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">
                  {group.title}
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {skills.map((skill) => {
                    const checked = form.skills.includes(skill.id);

                    return (
                      <label
                        key={skill.id}
                        className={`border rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer
                        ${
                          checked
                            ? "border-green-500 bg-green-50"
                            : "hover:border-gray-400"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSkill(skill.id)}
                        />
                        <span className="text-sm">{skill.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </Section>

        {/* ================= EDUCATION ================= */}
        <Section icon={<GraduationCap size={18} />} title="Học vấn (không bắt buộc)">
          {form.education.map((edu, index) => (
            <Card key={index} onRemove={() => removeEducation(index)}>
              <Select
                label="Loại học vấn"
                value={edu.level}
                onChange={(e) => updateEducation(index, "level", e.target.value)}
                options={[
                  { value: "", label: "-- Chọn --" },
                  { value: "high_school", label: "THPT" },
                  { value: "vocational", label: "Trung cấp / Nghề" },
                  { value: "college", label: "Cao đẳng" },
                  { value: "university", label: "Đại học" },
                  { value: "certificate", label: "Chứng chỉ" },
                  { value: "self_taught", label: "Tự học" },
                ]}
              />
              <Input label="Trường / Trung tâm" value={edu.institution} onChange={(e) => updateEducation(index, "institution", e.target.value)} />
              <Input label="Ngành học" value={edu.major} onChange={(e) => updateEducation(index, "major", e.target.value)} />
            </Card>
          ))}
          <AddButton label="Thêm học vấn" onClick={addEducation} />
        </Section>

        {/* ================= EXPERIENCE ================= */}
        <Section icon={<Briefcase size={18} />} title="Kinh nghiệm làm việc">
          {form.experiences.map((exp, index) => (
            <Card key={index} onRemove={() => removeExperience(index)}>
              <Input label="Công ty" value={exp.company} onChange={(e) => updateExperience(index, "company", e.target.value)} />
              <Input label="Vị trí" value={exp.position} onChange={(e) => updateExperience(index, "position", e.target.value)} />
              <Textarea label="Mô tả công việc" value={exp.description} onChange={(e) => updateExperience(index, "description", e.target.value)} />
            </Card>
          ))}
          <AddButton label="Thêm kinh nghiệm" onClick={addExperience} />
        </Section>

        {/* ================= ACTIONS ================= */}
        <div className="flex gap-3 pt-6 border-t">
          <button disabled={saving} className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg">
            <Save size={16} />
            {saving ? "Đang lưu..." : "Lưu hồ sơ"}
          </button>
          <button type="button" onClick={onCancel} className="flex items-center gap-2 bg-gray-200 px-6 py-2 rounded-lg">
            <X size={16} /> Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

/* ================= UI HELPERS ================= */

const Section = ({ icon, title, children }) => (
  <section>
    <div className="flex items-center gap-2 mb-4 text-gray-800">
      {icon}
      <h3 className="font-semibold">{title}</h3>
    </div>
    {children}
  </section>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {children}
  </div>
);

const Input = ({ label, icon, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      {icon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      )}
      <input {...props} className="w-full border rounded-lg px-3 py-2 mt-1" />
    </div>
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <textarea {...props} className="w-full border rounded-lg px-3 py-2 mt-1" rows={4} />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select {...props} className="w-full border rounded-lg px-3 py-2 mt-1">
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

const Card = ({ children, onRemove }) => (
  <div className="border rounded-xl p-4 mb-4 bg-gray-50 relative">
    <button type="button" onClick={onRemove} className="absolute top-3 right-3 text-red-500">
      <Trash2 size={16} />
    </button>
    <div className="space-y-3">{children}</div>
  </div>
);

const AddButton = ({ label, onClick }) => (
  <button type="button" onClick={onClick} className="flex items-center gap-1 text-green-600 text-sm">
    <Plus size={14} /> {label}
  </button>
);

export default EditProfileForm;
