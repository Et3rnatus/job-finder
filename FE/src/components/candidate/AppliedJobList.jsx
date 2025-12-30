function AppliedJobList() {
  const fakeJobs = [
    {
      id: 1,
      title: "Front-end Developer ReactJS",
      company: "Công ty ABC",
      date: "10/11/2025",
      status: "Đã ứng tuyển",
    },
    {
      id: 2,
      title: "Java Developer",
      company: "Công ty XYZ",
      date: "05/11/2025",
      status: "Đã ứng tuyển",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
      {/* HEADER */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Công việc đã ứng tuyển
      </h3>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600 border-b pb-2">
        <div>Công việc</div>
        <div>Công ty</div>
        <div>Ngày ứng tuyển</div>
        <div>Trạng thái</div>
      </div>

      {/* TABLE BODY */}
      <div className="divide-y">
        {fakeJobs.map((job) => (
          <div
            key={job.id}
            className="grid grid-cols-4 gap-4 py-3 text-sm text-gray-700"
          >
            <div className="font-medium text-gray-800">
              {job.title}
            </div>
            <div>{job.company}</div>
            <div>{job.date}</div>
            <div className="text-green-600 font-medium">
              {job.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AppliedJobList;
