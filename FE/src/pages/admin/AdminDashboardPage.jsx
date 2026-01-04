import { useEffect, useState } from "react";
import {
  getDashboard,
  getDashboardTrends,
  getJobTrends24h
} from "../../services/adminService";

import StatCard from "../../components/admin/StatCard";
import AdminDashboardTrends from "../../components/admin/AdminDashboardTrends";
import AdminDashboardTrends24h from "../../components/admin/AdminDashboardTrends24h";

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);

  // 🔹 7 days
  const [trendData, setTrendData] = useState([]);

  // 🔹 24 hours
  const [trend24hData, setTrend24hData] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        /* =====================
           1️⃣ DASHBOARD NUMBERS
        ===================== */
        const dashboardRes = await getDashboard();
        setData(dashboardRes);

        /* =====================
           2️⃣ DASHBOARD TRENDS – 7 DAYS
        ===================== */
        const trendsRes = await getDashboardTrends();

        const map = {};

        trendsRes.created.forEach((item) => {
          map[item.date] = {
            date: item.date,
            created: item.total,
            approved: 0,
          };
        });

        trendsRes.approved.forEach((item) => {
          if (!map[item.date]) {
            map[item.date] = {
              date: item.date,
              created: 0,
              approved: item.total,
            };
          } else {
            map[item.date].approved = item.total;
          }
        });

        setTrendData(
          Object.values(map).sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          )
        );

        /* =====================
           3️⃣ DASHBOARD TRENDS – 24 HOURS
        ===================== */
        const trends24hRes = await getJobTrends24h();

        // API 24h trả:
        // [{ hour, created, approved }]
        setTrend24hData(trends24hRes);

      } catch (error) {
        console.error("GET DASHBOARD ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  if (!data) {
    return (
      <p className="text-red-500">
        Không thể tải dữ liệu dashboard
      </p>
    );
  }

  return (
    <div>
      {/* ===== TITLE ===== */}
      <h1 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {/* ===== STAT CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <StatCard title="Total Users" value={data.total_users} />
        <StatCard title="Blocked Users" value={data.blocked_users} />
        <StatCard title="Pending Jobs" value={data.pending_jobs} highlight />
        <StatCard title="Approved Jobs" value={data.approved_jobs} />
        <StatCard title="Rejected Jobs" value={data.rejected_jobs} />
      </div>

      {/* ===== TRENDS – LAST 24 HOURS (NẰM TRÊN) ===== */}
      <AdminDashboardTrends24h data={trend24hData} />

      {/* ===== TRENDS – LAST 7 DAYS ===== */}
      <AdminDashboardTrends data={trendData} />
    </div>
  );
}
