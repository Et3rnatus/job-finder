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
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Việc làm đã đăng
      </h3>

      {/* JOB LIST */}
      {jobs.length === 0 ? (
        <p className="text-sm text-gray-500">
          Chưa có việc làm nào được đăng
        </p>
      ) : (
        <>
          {/* TABLE HEADER */}
          <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-600 border-b pb-2">
            <div>Công việc</div>
            <div>Địa điểm</div>
            <div>Thao tác</div>
          </div>

          {/* TABLE BODY */}
          <div className="divide-y">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="grid grid-cols-3 gap-4 py-3 text-sm text-gray-700"
              >
                <div className="font-medium text-gray-800">
                  {job.title}
                </div>
                <div>{job.location}</div>
                <div>
                  <button
                    onClick={() => handleViewApplicants(job.id)}
                    className="text-green-600 hover:underline"
                  >
                    Xem ứng viên
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* APPLICATION LIST */}
      {selectedJob && (
        <div className="mt-8">
          <h4 className="text-base font-semibold text-gray-800 mb-3">
            Danh sách ứng viên
          </h4>

          {applications.length === 0 ? (
            <p className="text-sm text-gray-500">
              Chưa có ứng viên ứng tuyển
            </p>
          ) : (
            <>
              {/* TABLE HEADER */}
              <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-600 border-b pb-2">
                <div>Họ tên</div>
                <div>Số điện thoại</div>
                <div>Trạng thái</div>
              </div>

              {/* TABLE BODY */}
              <div className="divide-y">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="grid grid-cols-3 gap-4 py-3 text-sm text-gray-700"
                  >
                    <div className="font-medium text-gray-800">
                      {app.full_name}
                    </div>
                    <div>{app.contact_number}</div>
                    <div className="text-green-600 font-medium">
                      {app.status}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default EmployerJobList;
