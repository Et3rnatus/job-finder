import { useEffect, useState } from "react";
import {
  getSkills,
  deleteSkill,
} from "../../services/adminService";
import SkillFormModal from "./SkillFormModal";
import DeleteSkillModal from "./DeleteSkillModal";
import SkillFilter from "./SkillFilter";

export default function SkillTable() {
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [filters, setFilters] = useState({});

  const fetchSkills = async () => {
    const data = await getSkills(filters);
    setSkills(data);
  };

  useEffect(() => {
    fetchSkills();
  }, [filters]);

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Skill Management</h2>
        <button
          onClick={() => {
            setSelectedSkill(null);
            setOpenForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Skill
        </button>
      </div>

      <SkillFilter onChange={setFilters} />

      <table className="w-full text-sm mt-4">
        <thead>
          <tr className="border-b text-left">
            <th>Name</th>
            <th>Type</th>
            <th>Category</th>
            <th>Jobs</th>
            <th>Candidates</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {skills.map((s) => (
            <tr key={s.id} className="border-b">
              <td>{s.name}</td>
              <td>{s.skill_type}</td>
              <td>{s.category_name || "-"}</td>
              <td>{s.job_count}</td>
              <td>{s.candidate_count}</td>
              <td className="flex gap-2 py-2">
                <button
                  className="text-blue-600"
                  onClick={() => {
                    setSelectedSkill(s);
                    setOpenForm(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-red-600"
                  onClick={() => {
                    setSelectedSkill(s);
                    setOpenDelete(true);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openForm && (
        <SkillFormModal
          skill={selectedSkill}
          onClose={() => setOpenForm(false)}
          onSuccess={fetchSkills}
        />
      )}

      {openDelete && (
        <DeleteSkillModal
          skill={selectedSkill}
          onClose={() => setOpenDelete(false)}
          onSuccess={fetchSkills}
        />
      )}
    </div>
  );
}
