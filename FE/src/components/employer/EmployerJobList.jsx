import { useEffect, useState } from "react";
import { getMyJobs, getApplicationsByJob } from "../../services/jobService";

function EmployerJobList() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getMyJobs().then(setJobs);
  }, []);

  const handleViewApplicants = async (jobId) => {
    setSelectedJob(jobId);
    const data = await getApplicationsByJob(jobId);
    setApplications(data);
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-xl font-bold mb-4">Việc làm đã đăng</h3>

      {/* JOB LIST */}
      {jobs.length === 0 && (
        <p className="text-gray-500">Chưa có việc làm nào</p>
      )}

      <ul className="space-y-3">
        {jobs.map(job => (
          <li
            key={job.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{job.title}</p>
              <p className="text-sm text-gray-600">{job.location}</p>
            </div>

            <button
              onClick={() => handleViewApplicants(job.id)}
              className="text-blue-600"
            >
              Xem ứng viên
            </button>
          </li>
        ))}
      </ul>

      {/* APPLICATION LIST */}
      {selectedJob && (
        <div className="mt-6">
          <h4 className="font-bold mb-2">Ứng viên ứng tuyển</h4>

          {applications.length === 0 && (
            <p className="text-gray-500">Chưa có ứng viên</p>
          )}

          <ul className="space-y-2">
            {applications.map(app => (
              <li key={app.id} className="border p-2 rounded">
                <p><strong>Họ tên:</strong> {app.full_name}</p>
                <p><strong>SĐT:</strong> {app.contact_number}</p>
                <p><strong>Trạng thái:</strong> {app.status}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default EmployerJobList;
