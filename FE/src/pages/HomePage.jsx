import HeroSection from "../components/home/HeroSection";
import JobList from "../components/home/JobList";
import KeyIndustries from "../components/home/KeyIndustries";
import TopCompanies from "../components/home/TopCompanies";

function HomePage() {
  return (
    <>
      {/* HERO + SEARCH */}
      <HeroSection />

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-14">

        {/* JOB LIST */}
        <section>
          <JobList />
        </section>

        {/* KEY INDUSTRIES */}
        <section>
          <KeyIndustries />
        </section>

        {/* TOP COMPANIES */}
        <section>
          <TopCompanies />
        </section>

      </main>
    </>
  );
}

export default HomePage;
