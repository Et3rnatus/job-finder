export default function SkillFilter({ onChange }) {
  return (
    <div className="flex gap-3 mb-3">
      <select
        onChange={(e) =>
          onChange((prev) => ({
            ...prev,
            skill_type: e.target.value || undefined,
          }))
        }
        className="border px-3 py-2 rounded"
      >
        <option value="">All Types</option>
        <option value="technical">Technical</option>
        <option value="soft">Soft Skill</option>
      </select>
    </div>
  );
}
