import { useEffect, useState } from "react";
import {
  getDashboard,
  getDashboardTrends,
  getJobTrends24h,
} from "../../services/adminService";

import StatCard from "../../components/admin/StatCard";
import AdminDashboardTrends from "../../components/admin/AdminDashboardTrends";
import AdminDashboardTrends24h from "../../components/admin/AdminDashboardTrends24h";
import {
  LayoutDashboard,
  Loader2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [trend24hData, setTrend24hData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        /* DASHBOARD NUMBERS */
        const dashboardRes = await getDashboard();
        setData(dashboardRes);

        /* TRENDS – 7 DAYS */
        const trendsRes = await getDashboardTrends();
        const map = {};

        trendsRes.created.forEach((i) => {
          map[i.date] = {
            date: i.date,
            created: i.total,
            approved: 0,
          };
        });

        trendsRes.approved.forEach((i) => {
          if (!map[i.date]) {
            map[i.date] = {
              date: i.date,
              created: 0,
              approved: i.total,
            };
          } else {
            map[i.date].approved = i.total;
          }
        });

        setTrendData(
          Object.values(map).sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          )
        );

        /* TRENDS – 24 HOURS */
        const trends24hRes = await getJobTrends24h();
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
    return (
      <div className="bg-white border border-gray-200 rounded-3xl p-16 flex flex-col items-center gap-4 text-gray-500">
        <Loader2 className="animate-spin" size={28} />
        Đang tải dữ liệu dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white border border-red-200 rounded-3xl p-12 text-center text-red-600">
        Không thể tải dữ liệu dashboard
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
          <LayoutDashboard size={26} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng quan hoạt động hệ thống
          </p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Users" value={data.total_users} />
        <StatCard title="Blocked Users" value={data.blocked_users} />
        <StatCard
          title="Pending Jobs"
          value={data.pending_jobs}
          highlight
        />
        <StatCard title="Approved Jobs" value={data.approved_jobs} />
        <StatCard title="Rejected Jobs" value={data.rejected_jobs} />
      </div>

      {/* TRENDS 24H */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">
          Xu hướng 24 giờ gần nhất
        </h2>
        <AdminDashboardTrends24h data={trend24hData} />
      </div>

      {/* TRENDS 7 DAYS */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">
          Xu hướng 7 ngày gần đây
        </h2>
        <AdminDashboardTrends data={trendData} />
      </div>
    </div>
  );
}
