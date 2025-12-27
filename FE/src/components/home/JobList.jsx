import JobCard from "../jobs/JobCard";
import { useEffect, useState } from "react";
import { getJobs } from "../../services/jobService";

function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getJobs().then((data) => {
      const mappedJobs = data.map((job) => ({
        id: job.id,
        type:"Tuyển dụng",
        title: job.title,
        salary: `${job.min_salary} - ${job.max_salary}`,
        location: job.location,
        company: job.company,
      }));
      setJobs(mappedJobs);
    })
    .catch((err) => console.error(err));
  },[]);

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
