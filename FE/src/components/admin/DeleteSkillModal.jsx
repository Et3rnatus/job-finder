import { deleteSkill } from "../../services/adminService";

export default function DeleteSkillModal({ skill, onClose, onSuccess }) {
  const handleDelete = async () => {
    await deleteSkill(skill.id);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h3 className="text-lg font-semibold mb-3">
          Delete Skill
        </h3>
        <p>
          Are you sure you want to delete{" "}
          <b>{skill.name}</b>?
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
