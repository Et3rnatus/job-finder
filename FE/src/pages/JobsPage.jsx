import Searchbar from "../components/layout/Searchbar";
import JobsHeader from "../components/jobs/JobsHeader";
import JobsFilterSidebar from "../components/jobs/JobsSideBarFilter";
import JobsResultList from "../components/jobs/JobsResultList";

function JobsPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Search bar */}
      <div className="bg-green-700 py-6">
        <Searchbar />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <JobsHeader />

        <div className="grid grid-cols-12 gap-6 mt-4">
          {/* LEFT FILTER */}
          <div className="col-span-12 md:col-span-3">
            <JobsFilterSidebar />
          </div>

          {/* RIGHT LIST */}
          <div className="col-span-12 md:col-span-9">
            <JobsResultList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobsPage;
