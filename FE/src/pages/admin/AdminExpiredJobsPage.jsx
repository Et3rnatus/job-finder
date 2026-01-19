import { useEffect, useState } from "react";
import { getExpiredJobs } from "../../services/adminService";
import {
  AlertOctagon,
  Loader2,
} from "lucide-react";

export default function AdminExpiredJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpiredJobs = async () => {
      try {
        setLoading(true);
        const res = await getExpiredJobs();
        setJobs(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("GET EXPIRED JOBS ERROR:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpiredJobs();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-20 flex flex-col items-center gap-4 text-gray-500">
        <Loader2 className="animate-spin text-red-500" size={32} />
        <p className="text-sm">Đang tải danh sách job hết hạn...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
          <AlertOctagon size={26} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Expired Jobs
          </h1>
          <p className="text-sm text-gray-500">
            Danh sách tin tuyển dụng đã hết hạn
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-red-200 rounded-3xl overflow-hidden">
        {jobs.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            Không có tin tuyển dụng nào đã hết hạn
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="px-6 py-4">Title</th>
                <th>Employer</th>
                <th>Expired At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b">
                  <td className="px-6 py-4 font-medium">
                    {job.title}
                  </td>
                  <td>{job.employer_email}</td>
                  <td className="text-red-600">
                    {new Date(job.expired_at).toLocaleDateString()}
                  </td>
                  <td>{job.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
