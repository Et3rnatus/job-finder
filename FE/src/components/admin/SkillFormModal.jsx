import { useEffect, useState } from "react";
import {
  createSkill,
  updateSkill,
  getCategories,
} from "../../services/adminService";

export default function SkillFormModal({ skill, onClose, onSuccess }) {
  const [name, setName] = useState(skill?.name || "");
  const [skillType, setSkillType] = useState(
    skill?.skill_type || "technical"
  );
  const [categoryId, setCategoryId] = useState(
    skill?.category_id || ""
  );
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =====================
     LOAD CATEGORIES
  ===================== */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        // chỉ lấy category đang active
        setCategories(data.filter((c) => c.is_active));
      } catch (err) {
        alert("Không thể tải danh sách ngành nghề");
      }
    };

    fetchCategories();
  }, []);

  /* =====================
     SUBMIT
  ===================== */
  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Vui lòng nhập tên kỹ năng");
      return;
    }

    if (!categoryId) {
      alert("Vui lòng chọn ngành nghề");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: name.trim(),
        category_id: categoryId,
        skill_type: skillType,
      };

      if (skill) {
        await updateSkill(skill.id, payload);
      } else {
        await createSkill(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      alert(
        err.response?.data?.message || "Lưu skill thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow">
        <h3 className="text-lg font-semibold mb-4">
          {skill ? "Edit Skill" : "Add Skill"}
        </h3>

        {/* SKILL NAME */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Skill name"
          className="w-full border px-3 py-2 rounded mb-3"
        />

        {/* CATEGORY */}
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
        >
          <option value="">-- Chọn ngành nghề --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* SKILL TYPE */}
        <select
          value={skillType}
          onChange={(e) => setSkillType(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        >
          <option value="technical">Technical</option>
          <option value="soft">Soft Skill</option>
        </select>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
