import SkillStatCard from "../../components/admin/SkillStatCard";
import SkillTable from "../../components/admin/SkillTable";

export default function AdminSkillPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Skill Management
        </h1>
        <p className="text-gray-500">
          Manage skills and analyze market demand
        </p>
      </div>

      {/* STAT */}
      <SkillStatCard />

      {/* CRUD TABLE */}
      <div className="mt-6">
        <SkillTable />
      </div>
    </div>
  );
}
