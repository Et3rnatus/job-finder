import JobCard from "../jobs/JobCard";

function JobList() {
  const jobs = [
    {
      id: 1,
      type: "Tuyển dụng",
      title: "Frontend Developer",
      salary: "$1000",
      location: "Hà Nội",
      experience: "1 năm",
      skills: "React, Tailwind",
    },
    {
      id: 2,
      type: "Tuyển dụng",
      title: "Backend Developer",
      salary: "$1200",
      location: "TP.HCM",
      experience: "2 năm",
      skills: "Node.js, MongoDB",
    },
    {
      id: 3,
      type: "Tuyển dụng",
      title: "UX/UI Designer",
      salary: "$900",
      location: "Đà Nẵng",
      experience: "1 năm",
      skills: "Figma, Adobe XD",
    },
  ];

  return (
    <div className="bg-white py-12 px-6">
      <h2 className="text-3xl font-bold text-left mb-8 text-gray-800">
        Việc làm nổi bật
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {jobs.map((job) => (
          <JobCard key={job.id} {...job} />
        ))}
      </div>
    </div>
  );
}

export default JobList;
