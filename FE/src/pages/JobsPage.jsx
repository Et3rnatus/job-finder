import Searchbar from "../components/layout/Searchbar";
import JobsHeader from "../components/jobs/JobsHeader";
import JobsFilterSidebar from "../components/jobs/JobsSideBarFilter";
import JobsResultList from "../components/jobs/JobsResultList";

function JobsPage() {
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

        {/* CONTENT */}
        <div className="grid grid-cols-12 gap-6">
          {/* FILTER SIDEBAR */}
          <aside className="col-span-12 md:col-span-3">
            <div className="md:sticky md:top-6">
              <JobsFilterSidebar />
            </div>
          </aside>

          {/* RESULT LIST */}
          <main className="col-span-12 md:col-span-9">
            <JobsResultList />
          </main>
        </div>
      </div>
    </div>
  );
}

export default JobsPage;
