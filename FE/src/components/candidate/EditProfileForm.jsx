import { useEffect, useState } from "react";
import candidateService from "../../services/candidateService";
import axios from "axios";
import {
  User,
  Phone,
  Calendar,
  Wrench,
  GraduationCap,
  Briefcase,
  Plus,
  Trash2,
  Save,
  X,
} from "lucide-react";

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

  /* ===== LOAD PROFILE ===== */
  useEffect(() => {
    if (profile) {
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
    }
  }, [profile]);

  /* ===== LOAD SKILLS ===== */
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:3001/api/skills");
        setAllSkills(res.data);
      } catch (error) {
        console.error("LOAD SKILLS ERROR:", error);
      }
    };
    loadSkills();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ===== SKILLS ===== */
  const toggleSkill = (skillId) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter((id) => id !== skillId)
        : [...prev.skills, skillId],
    }));
  };

  /* ===== EDUCATION ===== */
  const addEducation = () => {
    setForm((prev) => ({
      ...prev,
      education: [...prev.education, { school: "", degree: "", major: "" }],
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

  /* ===== EXPERIENCE ===== */
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
    } catch (error) {
      alert(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white border rounded-xl shadow-sm p-8">
      {/* ===== TITLE ===== */}
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
        Cập nhật hồ sơ ứng viên
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Thông tin này sẽ được sử dụng khi bạn ứng tuyển việc làm
      </p>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* ===== THÔNG TIN CÁ NHÂN ===== */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-gray-800">
            <User size={18} />
            <h4 className="font-semibold">Thông tin cá nhân</h4>
          </div>

          {/* ⚠️ FORM GIỮ NGUYÊN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Họ và tên"
              className="border p-2 rounded"
              required
            />
            <input
              name="contact_number"
              value={form.contact_number}
              onChange={handleChange}
              placeholder="Số điện thoại"
              className="border p-2 rounded"
              required
            />
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Địa chỉ"
              className="border p-2 rounded md:col-span-2"
            />
            <input
              value={profile.email || ""}
              disabled
              className="border p-2 rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Giới thiệu ngắn gọn về bản thân"
            className="w-full border p-2 rounded mt-4"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">-- Giới tính --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>

            <div className="relative">
              <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                name="date_of_birth"
                value={form.date_of_birth}
                onChange={handleChange}
                className="border p-2 rounded w-full pr-10"
                required
              />
            </div>
          </div>
        </section>

        {/* ===== SKILLS ===== */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-gray-800">
            <Wrench size={18} />
            <h4 className="font-semibold">Kỹ năng</h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {allSkills.map((skill) => (
              <label key={skill.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.skills.includes(skill.id)}
                  onChange={() => toggleSkill(skill.id)}
                />
                {skill.name}
              </label>
            ))}
          </div>
        </section>

        {/* ===== EDUCATION ===== */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-gray-800">
            <GraduationCap size={18} />
            <h4 className="font-semibold">Học vấn</h4>
          </div>

          {form.education.map((edu, index) => (
            <div key={index} className="border rounded p-4 mb-4 bg-gray-50">
              <input
                placeholder="Trường"
                value={edu.school || ""}
                onChange={(e) =>
                  updateEducation(index, "school", e.target.value)
                }
                className="w-full border p-2 rounded mb-2"
              />
              <input
                placeholder="Bằng cấp"
                value={edu.degree || ""}
                onChange={(e) =>
                  updateEducation(index, "degree", e.target.value)
                }
                className="w-full border p-2 rounded mb-2"
              />
              <input
                placeholder="Chuyên ngành"
                value={edu.major || ""}
                onChange={(e) =>
                  updateEducation(index, "major", e.target.value)
                }
                className="w-full border p-2 rounded"
              />
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="flex items-center gap-1 text-red-600 text-sm mt-2"
              >
                <Trash2 size={14} /> Xóa
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addEducation}
            className="flex items-center gap-1 text-green-600 text-sm"
          >
            <Plus size={14} /> Thêm học vấn
          </button>
        </section>

        {/* ===== EXPERIENCE ===== */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-gray-800">
            <Briefcase size={18} />
            <h4 className="font-semibold">Kinh nghiệm làm việc</h4>
          </div>

          {form.experiences.map((exp, index) => (
            <div key={index} className="border rounded p-4 mb-4 bg-gray-50">
              <input
                placeholder="Công ty"
                value={exp.company || ""}
                onChange={(e) =>
                  updateExperience(index, "company", e.target.value)
                }
                className="w-full border p-2 rounded mb-2"
              />
              <input
                placeholder="Vị trí"
                value={exp.position || ""}
                onChange={(e) =>
                  updateExperience(index, "position", e.target.value)
                }
                className="w-full border p-2 rounded mb-2"
              />
              <textarea
                placeholder="Mô tả công việc"
                value={exp.description || ""}
                onChange={(e) =>
                  updateExperience(index, "description", e.target.value)
                }
                className="w-full border p-2 rounded"
              />
              <button
                type="button"
                onClick={() => removeExperience(index)}
                className="flex items-center gap-1 text-red-600 text-sm mt-2"
              >
                <Trash2 size={14} /> Xóa
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addExperience}
            className="flex items-center gap-1 text-green-600 text-sm"
          >
            <Plus size={14} /> Thêm kinh nghiệm
          </button>
        </section>

        {/* ===== ACTIONS ===== */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            disabled={saving}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Đang lưu..." : "Lưu hồ sơ"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-2 rounded"
          >
            <X size={16} /> Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfileForm;
