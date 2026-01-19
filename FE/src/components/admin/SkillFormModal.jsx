import { useState } from "react";
import {
  createSkill,
  updateSkill,
} from "../../services/adminService";

export default function SkillFormModal({ skill, onClose, onSuccess }) {
  const [name, setName] = useState(skill?.name || "");
  const [skillType, setSkillType] = useState(skill?.skill_type || "technical");

  const handleSubmit = async () => {
    if (!name.trim()) return;

    if (skill) {
      await updateSkill(skill.id, {
        name,
        skill_type: skillType,
      });
    } else {
      await createSkill({
        name,
        skill_type: skillType,
      });
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h3 className="text-lg font-semibold mb-4">
          {skill ? "Edit Skill" : "Add Skill"}
        </h3>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Skill name"
          className="w-full border px-3 py-2 rounded mb-3"
        />

        <select
          value={skillType}
          onChange={(e) => setSkillType(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        >
          <option value="technical">Technical</option>
          <option value="soft">Soft Skill</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
