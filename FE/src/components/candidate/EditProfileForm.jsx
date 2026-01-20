import { useEffect, useState } from "react";
import candidateService from "../../services/candidateService";
import { getAllSkills } from "../../services/skillService";
import {
  User,
  Wrench,
  GraduationCap,
  Briefcase,
  Plus,
  Trash2,
  Save,
  X,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function EditProfileForm({ profile, onUpdated, onCancel }) {
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

  // 🔥 FILTER STATE
  const [skillType, setSkillType] = useState("ALL"); // ALL | TECH | SOFT
  const [categoryId, setCategoryId] = useState("ALL"); // ALL | number

  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  /* =====================
     LOAD PROFILE
  ===================== */
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
      education: Array.isArray(profile.education)
        ? profile.education.map((e) => ({
            institution: e.school || "",
            level: e.degree || "",
            major: e.major || "",
          }))
        : [],
      experiences: Array.isArray(profile.experiences)
        ? profile.experiences
        : [],
    });
  }, [profile]);

  /* =====================
     LOAD SKILLS
  ===================== */
  useEffect(() => {
  getAllSkills()
    .then((skills) => {
      setAllSkills(skills); // skills là ARRAY
    })
    .catch(() =>
      setAlert({
        type: "error",
        title: "Lỗi",
        message: "Không thể tải danh sách kỹ năng",
      })
    );
}, []);



  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* =====================
     SKILLS (NGÀNH + LOẠI)
  ===================== */
  const toggleSkill = (skillId) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter((id) => id !== skillId)
        : [...prev.skills, skillId],
    }));
  };

  const visibleSkills = (Array.isArray(allSkills) ? allSkills : [])
  .filter((skill) => {
    const skillCategoryId = Number(skill.category_id);
    const selectedCategoryId =
      categoryId === "ALL" ? "ALL" : Number(categoryId);

    if (skillType === "TECH" && skill.skill_type !== "technical") return false;
    if (skillType === "SOFT" && skill.skill_type !== "soft") return false;

    if (selectedCategoryId !== "ALL") {
      if (
        skill.skill_type === "technical" &&
        skillCategoryId !== selectedCategoryId
      ) {
        return false;
      }
    }

    return true;
  })
  .sort((a, b) => a.name.localeCompare(b.name));


  /* =====================
     EDUCATION
  ===================== */
  const addEducation = () =>
    setForm((p) => ({
      ...p,
      education: [...p.education, { institution: "", level: "", major: "" }],
    }));

  const updateEducation = (i, f, v) => {
    const updated = [...form.education];
    updated[i][f] = v;
    setForm({ ...form, education: updated });
  };

  const removeEducation = (i) =>
    setForm({
      ...form,
      education: form.education.filter((_, idx) => idx !== i),
    });

  /* =====================
     EXPERIENCE
  ===================== */
  const addExperience = () =>
    setForm((p) => ({
      ...p,
      experiences: [
        ...p.experiences,
        { company: "", position: "", description: "" },
      ],
    }));

  const updateExperience = (i, f, v) => {
    const updated = [...form.experiences];
    updated[i][f] = v;
    setForm({ ...form, experiences: updated });
  };

  const removeExperience = (i) =>
    setForm({
      ...form,
      experiences: form.experiences.filter((_, idx) => idx !== i),
    });

  /* =====================
     SUBMIT
  ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.full_name || !form.contact_number || !form.date_of_birth) {
      return setAlert({
        type: "error",
        title: "Thiếu thông tin",
        message: "Vui lòng nhập đầy đủ họ tên, số điện thoại và ngày sinh",
      });
    }

    if (!form.skills.length) {
      return setAlert({
        type: "error",
        title: "Thiếu kỹ năng",
        message: "Vui lòng chọn ít nhất một kỹ năng",
      });
    }

    try {
      setSaving(true);

      const payload = {
        full_name: form.full_name,
        contact_number: form.contact_number,
        address: form.address || null,
        bio: form.bio || null,
        gender: form.gender || null,
        date_of_birth: form.date_of_birth,
        skills: form.skills,
        education: form.education
          .filter((e) => e.institution || e.level || e.major)
          .map((e) => ({
            school: e.institution,
            degree: e.level,
            major: e.major,
          })),
        experiences: form.experiences,
      };

      await candidateService.updateProfile(payload);

      setAlert({
        type: "success",
        title: "Thành công",
        message: "Cập nhật hồ sơ thành công",
      });
    } catch (err) {
      setAlert({
        type: "error",
        title: "Thất bại",
        message:
          err.response?.data?.message || "Cập nhật hồ sơ thất bại",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto bg-white border rounded-2xl shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-14">

          {/* PERSONAL */}
          <Section icon={<User size={18} />} title="Thông tin cá nhân">
            <Grid>
              <Input label="Họ và tên *" name="full_name" value={form.full_name} onChange={handleChange} />
              <Input label="Số điện thoại *" name="contact_number" value={form.contact_number} onChange={handleChange} />
              <Input label="Email" value={profile.email || ""} disabled />
              <Input label="Địa chỉ" name="address" value={form.address} onChange={handleChange} />
            </Grid>

            <Textarea label="Giới thiệu bản thân" name="bio" value={form.bio} onChange={handleChange} />

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
              <Input type="date" label="Ngày sinh *" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} />
            </Grid>
          </Section>

          {/* SKILLS */}
          <Section icon={<Wrench size={18} />} title="Kỹ năng">
  <p className="text-sm text-gray-500 mb-2">
    Bạn có thể chọn kỹ năng mềm nếu không thuộc ngành nghề cụ thể.
  </p>


            {/* CHỌN NGÀNH */}
            <div className="flex gap-2 mb-3">
              {[
                { id: "ALL", label: "Tất cả" },
                { id: 1, label: "CNTT" },
                { id: 2, label: "Marketing" },
                { id: 3, label: "Kinh doanh" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategoryId(c.id)}
                  className={`px-4 py-1.5 rounded-full text-sm border ${
                    categoryId === c.id
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-gray-100"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* CHỌN LOẠI */}
            <div className="flex gap-2 mb-4">
              {[
                { id: "ALL", label: "Tất cả" },
                { id: "TECH", label: "Kỹ năng chuyên môn" },
                { id: "SOFT", label: "Kỹ năng mềm" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSkillType(t.id)}
                  className={`px-4 py-1.5 rounded-full text-sm border ${
                    skillType === t.id
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-gray-100"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {visibleSkills.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => toggleSkill(skill.id)}
                  className={`px-3 py-1.5 rounded-full text-sm border ${
                    form.skills.includes(skill.id)
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-gray-100"
                  }`}
                >
                  {skill.name}
                </button>
              ))}
            </div>
          </Section>

          {/* EDUCATION */}
          <Section icon={<GraduationCap size={18} />} title="Học vấn">
            {form.education.map((edu, i) => (
              <Card key={i} onRemove={() => removeEducation(i)}>
                <Input label="Tên trường" value={edu.institution} onChange={(e) => updateEducation(i, "institution", e.target.value)} />
                <Input label="Trình độ" value={edu.level} onChange={(e) => updateEducation(i, "level", e.target.value)} />
                <Input label="Ngành" value={edu.major} onChange={(e) => updateEducation(i, "major", e.target.value)} />
              </Card>
            ))}
            <AddButton label="Thêm học vấn" onClick={addEducation} />
          </Section>

          {/* EXPERIENCE */}
          <Section icon={<Briefcase size={18} />} title="Kinh nghiệm">
            {form.experiences.map((exp, i) => (
              <Card key={i} onRemove={() => removeExperience(i)}>
                <Input label="Công ty" value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} />
                <Input label="Vị trí" value={exp.position} onChange={(e) => updateExperience(i, "position", e.target.value)} />
                <Textarea label="Mô tả công việc" value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} />
              </Card>
            ))}
            <AddButton label="Thêm kinh nghiệm" onClick={addExperience} />
          </Section>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-8 border-t">
            <button disabled={saving} className="h-11 px-6 bg-green-600 text-white rounded-lg flex items-center gap-2">
              <Save size={16} />
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button type="button" onClick={onCancel} className="h-11 px-6 bg-gray-200 rounded-lg flex items-center gap-2">
              <X size={16} />
              Hủy
            </button>
          </div>
        </form>
      </div>

      {alert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-2xl text-center">
            {alert.type === "success" ? (
              <CheckCircle2 className="text-green-600 mx-auto" size={36} />
            ) : (
              <AlertTriangle className="text-red-600 mx-auto" size={36} />
            )}
            <h3 className="font-semibold mt-3">{alert.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{alert.message}</p>
            <button
              onClick={() => {
                setAlert(null);
                if (alert.type === "success") onUpdated();
              }}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* =====================
   UI HELPERS
===================== */

const Section = ({ icon, title, children }) => (
  <section>
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3 className="font-semibold text-lg">{title}</h3>
    </div>
    {children}
  </section>
);

const Grid = ({ children }) => (
  <div className="grid md:grid-cols-2 gap-4">{children}</div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <input {...props} className="w-full border px-3 py-2 rounded-lg mt-1" />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <textarea {...props} rows={4} className="w-full border px-3 py-2 rounded-lg mt-1" />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <select {...props} className="w-full border px-3 py-2 rounded-lg mt-1">
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

const Card = ({ children, onRemove }) => (
  <div className="border rounded-xl p-4 bg-gray-50 relative space-y-3">
    <button type="button" onClick={onRemove} className="absolute top-3 right-3 text-red-500">
      <Trash2 size={16} />
    </button>
    {children}
  </div>
);

const AddButton = ({ label, onClick }) => (
  <button type="button" onClick={onClick} className="text-green-600 flex items-center gap-1 text-sm hover:underline">
    <Plus size={14} /> {label}
  </button>
);
