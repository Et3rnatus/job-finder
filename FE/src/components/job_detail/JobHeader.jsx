function JobHeader({ job }) {
  return (
    <div className="bg-white p-6 shadow rounded mb-4">
      <h1 className="text-2xl font-bold mb-2">{job.title}</h1>

      <div className="text-gray-700">
        <p className="font-medium">{job.company}</p>
        <p className="text-sm">{job.location}</p>
      </div>

      <div className="mt-3">
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded">
          {job.salary}
        </span>
      </div>
    </div>
  );
}
export default JobHeader;
