import { useEffect, useState } from "react";
import candidateService from "../../services/candidateService";
import { getAllSkills } from "../../services/skillService";
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

/* ================= SKILL GROUPS (FE ONLY) =================
   Chỉ dùng để GROUP UI, không ảnh hưởng backend
=========================================================== */
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
  marketing: {
    title: "📊 Marketing / Kinh doanh",
    match: [
      "Digital Marketing",
      "SEO",
      "Facebook Ads",
      "Google Ads",
      "Content Marketing",
    ],
  },
  business: {
    title: "📁 Nghiệp vụ / Quản lý",
    match: [
      "Kế toán",
      "Thuế",
      "Kiểm toán",
      "Quản lý",
    ],
  },
  soft: {
    title: "🤝 Kỹ năng mềm",
    match: [
      "Giao tiếp",
      "Làm việc nhóm",
      "Quản lý thời gian",
      "Giải quyết vấn đề",
      "Thuyết trình",
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

  /* ================= LOAD ALL SKILLS (CANDIDATE) ================= */
  useEffect(() => {
    getAllSkills()
      .then(setAllSkills)
      .catch((err) => console.error("LOAD SKILLS ERROR:", err));
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
        { institution: "", level: "", major: "" },
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

      // 🔥 MAP ĐÚNG BACKEND
      const payload = {
        full_name: form.full_name,
        contact_number: form.contact_number,
        address: form.address || null,
        bio: form.bio || null,
        gender: form.gender || null,
        date_of_birth: form.date_of_birth,
        skills: form.skills,
        education: form.education.map((edu) => ({
          school: edu.institution,
          degree: edu.level,
          major: edu.major,
        })),
        experiences: form.experiences,
      };

      await candidateService.updateProfile(payload);

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
      <form onSubmit={handleSubmit} className="space-y-12">

        {/* ================= PERSONAL INFO ================= */}
        <Section icon={<User size={18} />} title="Thông tin cá nhân">
          <Grid>
            <Input label="Họ và tên *" name="full_name" value={form.full_name} onChange={handleChange} />
            <Input label="Số điện thoại *" name="contact_number" value={form.contact_number} onChange={handleChange} />
            <Input label="Email" value={profile.email || ""} disabled />
            <Input label="Địa chỉ" name="address" value={form.address} onChange={handleChange} />
          </Grid>

          <Textarea label="Giới thiệu" name="bio" value={form.bio} onChange={handleChange} />

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

        {/* ================= SKILLS ================= */}
        <Section icon={<Wrench size={18} />} title="Kỹ năng">
          {Object.values(SKILL_GROUPS).map((group) => {
            const skills = allSkills.filter((s) =>
              group.match.includes(s.name)
            );
            if (!skills.length) return null;

            return (
              <div key={group.title}>
                <h4 className="font-medium mb-3">{group.title}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {skills.map((skill) => (
                    <label key={skill.id} className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        checked={form.skills.includes(skill.id)}
                        onChange={() => toggleSkill(skill.id)}
                      />
                      <span>{skill.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </Section>

        {/* ================= EDUCATION ================= */}
        <Section icon={<GraduationCap size={18} />} title="Học vấn">
          {form.education.map((edu, index) => (
            <Card key={index} onRemove={() => removeEducation(index)}>
              <Input label="Trường" value={edu.institution} onChange={(e) => updateEducation(index, "institution", e.target.value)} />
              <Input label="Trình độ" value={edu.level} onChange={(e) => updateEducation(index, "level", e.target.value)} />
              <Input label="Ngành" value={edu.major} onChange={(e) => updateEducation(index, "major", e.target.value)} />
            </Card>
          ))}
          <AddButton label="Thêm học vấn" onClick={addEducation} />
        </Section>

        {/* ================= EXPERIENCE ================= */}
        <Section icon={<Briefcase size={18} />} title="Kinh nghiệm">
          {form.experiences.map((exp, index) => (
            <Card key={index} onRemove={() => removeExperience(index)}>
              <Input label="Công ty" value={exp.company} onChange={(e) => updateExperience(index, "company", e.target.value)} />
              <Input label="Vị trí" value={exp.position} onChange={(e) => updateExperience(index, "position", e.target.value)} />
              <Textarea label="Mô tả" value={exp.description} onChange={(e) => updateExperience(index, "description", e.target.value)} />
            </Card>
          ))}
          <AddButton label="Thêm kinh nghiệm" onClick={addExperience} />
        </Section>

        <div className="flex gap-3 pt-6 border-t">
          <button disabled={saving} className="bg-green-600 text-white px-6 py-2 rounded-lg flex gap-2">
            <Save size={16} /> {saving ? "Đang lưu..." : "Lưu"}
          </button>
          <button type="button" onClick={onCancel} className="bg-gray-200 px-6 py-2 rounded-lg flex gap-2">
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
    <div className="flex items-center gap-2 mb-4">{icon}<h3>{title}</h3></div>
    {children}
  </section>
);

const Grid = ({ children }) => <div className="grid md:grid-cols-2 gap-4">{children}</div>;

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm">{label}</label>
    <input {...props} className="w-full border px-3 py-2 rounded mt-1" />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="text-sm">{label}</label>
    <textarea {...props} className="w-full border px-3 py-2 rounded mt-1" />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="text-sm">{label}</label>
    <select {...props} className="w-full border px-3 py-2 rounded mt-1">
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Card = ({ children, onRemove }) => (
  <div className="border p-4 rounded relative bg-gray-50">
    <button onClick={onRemove} className="absolute top-2 right-2 text-red-500">
      <Trash2 size={16} />
    </button>
    <div className="space-y-3">{children}</div>
  </div>
);

const AddButton = ({ label, onClick }) => (
  <button type="button" onClick={onClick} className="text-green-600 flex gap-1">
    <Plus size={14} /> {label}
  </button>
);

export default EditProfileForm;
