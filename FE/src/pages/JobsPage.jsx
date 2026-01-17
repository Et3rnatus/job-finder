import { useEffect, useState } from "react";

import Searchbar from "../components/layout/Searchbar";
import JobsHeader from "../components/jobs/JobsHeader";
import JobsFilterSidebar from "../components/jobs/JobsSideBarFilter";
import JobsResultList from "../components/jobs/JobsResultList";

import { getJobs, filterJobs } from "../services/jobService";

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  /* =====================
     LOAD DEFAULT JOBS
  ===================== */
  const loadAllJobs = async () => {
    setLoading(true);
    try {
      const data = await getJobs();
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("LOAD JOBS ERROR:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllJobs();
  }, []);

  /* =====================
     HANDLE FILTER CHANGE
  ===================== */
  const handleFilterChange = async (filters) => {
    setLoading(true);
    setIsFiltering(true);

    try {
      const hasCategory =
        filters.categoryIds && filters.categoryIds.length > 0;
      const hasSkill =
        filters.skillIds && filters.skillIds.length > 0;

      // ❗ Không chọn filter nào → quay về all jobs
      if (!hasCategory && !hasSkill) {
        await loadAllJobs();
        setIsFiltering(false);
        return;
      }

      const data = await filterJobs(filters);
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("FILTER JOBS ERROR:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* =====================
          SEARCH HERO
      ===================== */}
      <div className="bg-green-700 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <Searchbar />
        </div>
      </div>

      {/* =====================
          MAIN CONTENT
      ===================== */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* HEADER */}
        <JobsHeader />

        <div className="grid grid-cols-12 gap-6">
          {/* =====================
              FILTER SIDEBAR
          ===================== */}
          <aside className="col-span-12 md:col-span-3">
            <div className="md:sticky md:top-6">
              <JobsFilterSidebar onChange={handleFilterChange} />
            </div>
          </aside>

          {/* =====================
              RESULT LIST
          ===================== */}
          <main className="col-span-12 md:col-span-9">
            <JobsResultList
              jobs={jobs}
              loading={loading}
              isFiltering={isFiltering}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

export default JobsPage;
