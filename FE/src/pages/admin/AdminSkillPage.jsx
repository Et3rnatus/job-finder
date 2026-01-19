import SkillTable from "../../components/admin/SkillTable";
import SkillStatCard from "../../components/admin/SkillStatCard";

export default function AdminSkillPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Skill Management</h1>
        <p className="text-gray-500">
          Manage skills used by candidates and employers
        </p>
      </div>

      {/* ⭐ STAT CARDS */}
      <SkillStatCard />

      {/* TABLE */}
      <SkillTable />
    </div>
  );
}
