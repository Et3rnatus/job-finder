import { useEffect, useState } from "react";
import { Brain, Code, Layers } from "lucide-react";
import { getSkillStats } from "../../services/adminService";
import StatCard from "./StatCard";

export default function SkillStatCards() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getSkillStats().then(setStats);
  }, []);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard
        title="Total Skills"
        value={stats.total}
        icon={Layers}
        color="emerald"
      />

      <StatCard
        title="Soft Skills"
        value={stats.soft}
        icon={Brain}
        color="blue"
      />

      <StatCard
        title="Technical Skills"
        value={stats.technical}
        icon={Code}
        color="purple"
      />
    </div>
  );
}
