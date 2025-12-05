function AppliedJobList() {
  const fakeJobs = [
    {
      id: 1,
      title: "Front-end Developer ReactJS",
      company: "Công ty ABC",
      date: "10/11/2025",
    },
    {
      id: 2,
      title: "Java Developer",
      company: "Công ty XYZ",
      date: "05/11/2025",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Công việc đã ứng tuyển
      </h3>

      <ul className="space-y-4">
        {fakeJobs.map(job => (
          <li key={job.id} className="border-b pb-3">
            <h4 className="font-semibold text-gray-800">{job.title}</h4>
            <p className="text-gray-600">{job.company}</p>
            <p className="text-sm text-gray-500">Ngày ứng tuyển: {job.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AppliedJobList;
