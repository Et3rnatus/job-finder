import { useEffect, useState } from "react";
import Searchbar from "../components/layout/Searchbar";
import JobsHeader from "../components/jobs/JobsHeader";
import JobsFilterSidebar from "../components/jobs/JobsSideBarFilter";
import JobsResultList from "../components/jobs/JobsResultList";
import { getJobs, filterJobs } from "../services/jobService";

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  /* =====================
     LOAD DEFAULT JOBS
  ===================== */
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const data = await getJobs();
        setJobs(data);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  /* =====================
     HANDLE FILTER
  ===================== */
  const handleFilterChange = async (filters) => {
    setLoading(true);
    setIsFiltering(true);

    try {
      // Không chọn gì → load lại all jobs
      if (
        (!filters.categoryIds || filters.categoryIds.length === 0) &&
        (!filters.skillIds || filters.skillIds.length === 0)
      ) {
        const data = await getJobs();
        setJobs(data);
        setIsFiltering(false);
        return;
      }

      const data = await filterJobs(filters);
      setJobs(data);
    } catch (error) {
      console.error("FILTER ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* SEARCH HERO */}
      <div className="bg-green-700 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <Searchbar />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <JobsHeader />

        <div className="grid grid-cols-12 gap-6">
          {/* FILTER */}
          <aside className="col-span-12 md:col-span-3">
            <div className="md:sticky md:top-6">
              <JobsFilterSidebar onChange={handleFilterChange} />
            </div>
          </aside>

          {/* RESULT */}
          <main className="col-span-12 md:col-span-9">
            <JobsResultList jobs={jobs} loading={loading} />
          </main>
        </div>
      </div>
    </div>
  );
}

export default JobsPage;
