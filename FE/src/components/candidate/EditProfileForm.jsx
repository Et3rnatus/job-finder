import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../services/candidateService";

function EditProfileForm({ onCancel }) {
  const [form, setForm] = useState({
    full_name: "",
    contact_number: "",
    address: "",
    bio: "",
    gender: "",
    date_of_birth: "",
    skills: [],
    education: [],
    experiences: []
  });

  const [allSkills, setAllSkills] = useState([]);

  // ================= LOAD DATA =================
  useEffect(() => {
    // Load profile
    getProfile().then(data => {
      setForm({
        full_name: data.full_name || "",
        contact_number: data.contact_number || "",
        address: data.address || "",
        bio: data.bio || "",
        gender: data.gender || "",
        date_of_birth: data.date_of_birth || "",
        skills: data.skills ? data.skills.map(s => s.id) : [],
        education: data.education || [],
        experiences: data.experiences || []
      });
    });

    // Load skills
    fetch("http://127.0.0.1:3001/api/skills")
      .then(res => res.json())
      .then(data => setAllSkills(data));
  }, []);

  // ================= BASIC INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SKILLS =================
  const toggleSkill = (skillId) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter(id => id !== skillId)
        : [...prev.skills, skillId]
    }));
  };

  // ================= EDUCATION =================
  const addEducation = () => {
    setForm(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { school: "", degree: "", major: "", start_date: "", end_date: "" }
      ]
    }));
  };

  const updateEducation = (index, field, value) => {
    const updated = [...form.education];
    updated[index][field] = value;
    setForm({ ...form, education: updated });
  };

  const removeEducation = (index) => {
    const updated = form.education.filter((_, i) => i !== index);
    setForm({ ...form, education: updated });
  };

  // ================= EXPERIENCE =================
  const addExperience = () => {
    setForm(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { company: "", position: "", start_date: "", end_date: "", description: "" }
      ]
    }));
  };

  const updateExperience = (index, field, value) => {
    const updated = [...form.experiences];
    updated[index][field] = value;
    setForm({ ...form, experiences: updated });
  };

  const removeExperience = (index) => {
    const updated = form.experiences.filter((_, i) => i !== index);
    setForm({ ...form, experiences: updated });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProfile(form);
      alert("Cập nhật hồ sơ thành công");
      onCancel();
    } catch (err) {
      alert("Cập nhật thất bại");
    }
  };

  // ================= UI =================
  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-2xl font-bold mb-4">Cập nhật hồ sơ ứng viên</h3>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ===== THÔNG TIN CÁ NHÂN ===== */}
        <div>
          <h4 className="font-semibold mb-2">Thông tin cá nhân</h4>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Họ và tên"
            className="w-full border p-2 rounded mb-2"
          />
          <input
            name="contact_number"
            value={form.contact_number}
            onChange={handleChange}
            placeholder="Số điện thoại"
            className="w-full border p-2 rounded mb-2"
          />
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Địa chỉ"
            className="w-full border p-2 rounded mb-2"
          />
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Giới thiệu bản thân"
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
  {/* GIỚI TÍNH */}
  <div>
    <label className="block font-medium mb-1">Giới tính</label>
    <select
      name="gender"
      value={form.gender}
      onChange={handleChange}
      className="w-full border p-2 rounded"
    >
      <option value="">-- Chọn giới tính --</option>
      <option value="male">Nam</option>
      <option value="female">Nữ</option>
      <option value="other">Khác</option>
    </select>
  </div>

  {/* NGÀY SINH */}
  <div>
    <label className="block font-medium mb-1">Ngày sinh</label>
    <input
      type="date"
      name="date_of_birth"
      value={form.date_of_birth}
      onChange={handleChange}
      className="w-full border p-2 rounded"
    />
  </div>
</div>
        {/* ===== SKILLS ===== */}
        <div>
          <h4 className="font-semibold mb-2">Kỹ năng</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {allSkills.map(skill => (
              <label key={skill.id} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={form.skills.includes(skill.id)}
                  onChange={() => toggleSkill(skill.id)}
                />
                {skill.name}
              </label>
            ))}
          </div>
        </div>

        {/* ===== EDUCATION ===== */}
        <div>
          <h4 className="font-semibold mb-2">Học vấn (không bắt buộc)</h4>

          {form.education.map((edu, index) => (
            <div key={index} className="border p-3 rounded mb-2">
              <input
                placeholder="Trường"
                value={edu.school}
                onChange={e => updateEducation(index, "school", e.target.value)}
                className="w-full border p-2 rounded mb-2"
              />
              <input
                placeholder="Bằng cấp"
                value={edu.degree}
                onChange={e => updateEducation(index, "degree", e.target.value)}
                className="w-full border p-2 rounded mb-2"
              />
              <input
                placeholder="Chuyên ngành"
                value={edu.major}
                onChange={e => updateEducation(index, "major", e.target.value)}
                className="w-full border p-2 rounded mb-2"
              />
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="text-red-600 text-sm"
              >
                Xóa
              </button>
            </div>
          ))}

          <button type="button" onClick={addEducation} className="text-blue-600">
            + Thêm học vấn
          </button>
        </div>

        {/* ===== EXPERIENCE ===== */}
        <div>
          <h4 className="font-semibold mb-2">Kinh nghiệm làm việc (không bắt buộc)</h4>

          {form.experiences.map((exp, index) => (
            <div key={index} className="border p-3 rounded mb-2">
              <input
                placeholder="Công ty"
                value={exp.company}
                onChange={e => updateExperience(index, "company", e.target.value)}
                className="w-full border p-2 rounded mb-2"
              />
              <input
                placeholder="Vị trí"
                value={exp.position}
                onChange={e => updateExperience(index, "position", e.target.value)}
                className="w-full border p-2 rounded mb-2"
              />
              <textarea
                placeholder="Mô tả công việc"
                value={exp.description}
                onChange={e => updateExperience(index, "description", e.target.value)}
                className="w-full border p-2 rounded mb-2"
              />
              <button
                type="button"
                onClick={() => removeExperience(index)}
                className="text-red-600 text-sm"
              >
                Xóa
              </button>
            </div>
          ))}

          <button type="button" onClick={addExperience} className="text-blue-600">
            + Thêm kinh nghiệm
          </button>
        </div>

        {/* ===== BUTTON ===== */}
        <div className="flex gap-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Lưu hồ sơ
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfileForm;
