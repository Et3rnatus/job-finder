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
  AlertTriangle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [trend24hData, setTrend24hData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =====================
     FETCH DASHBOARD
  ===================== */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        /* DASHBOARD STATS */
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

        /* TRENDS – 24H */
        const trends24hRes = await getJobTrends24h();
        setTrend24hData(
          Array.isArray(trends24hRes) ? trends24hRes : []
        );
      } catch (error) {
        console.error("GET DASHBOARD ERROR:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /* =====================
     LOADING
  ===================== */
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-3xl p-20 flex flex-col items-center gap-4 text-gray-500 shadow-sm">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
        <p className="text-sm">Đang tải dữ liệu dashboard...</p>
      </div>
    );
  }

  /* =====================
     ERROR
  ===================== */
  if (!data) {
    return (
      <div className="bg-white border border-red-200 rounded-3xl p-16 flex flex-col items-center gap-4 text-red-600 shadow-sm">
        <AlertTriangle size={32} />
        <p className="font-semibold">
          Không thể tải dữ liệu dashboard
        </p>
        <p className="text-sm text-red-500">
          Vui lòng thử lại sau
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* =====================
          HEADER
      ===================== */}
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <LayoutDashboard size={26} />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng quan hoạt động và xu hướng hệ thống
          </p>
        </div>
      </div>

      {/* =====================
          STAT CARDS
      ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Users"
          value={data.total_users}
        />
        <StatCard
          title="Blocked Users"
          value={data.blocked_users}
        />
        <StatCard
          title="Pending Jobs"
          value={data.pending_jobs}
          highlight
        />
        <StatCard
          title="Approved Jobs"
          value={data.approved_jobs}
        />
        <StatCard
          title="Rejected Jobs"
          value={data.rejected_jobs}
        />
      </div>

      {/* =====================
          TRENDS – 24H
      ===================== */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Xu hướng 24 giờ gần nhất
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Biến động tin tuyển dụng theo từng giờ
          </p>
        </div>

        <AdminDashboardTrends24h data={trend24hData} />
      </div>

      {/* =====================
          TRENDS – 7 DAYS
      ===================== */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Xu hướng 7 ngày gần đây
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            So sánh tin tạo mới và được duyệt
          </p>
        </div>

        <AdminDashboardTrends data={trendData} />
      </div>
    </div>
  );
}
