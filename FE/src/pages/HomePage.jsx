import HeroSection from '../components/home/HeroSection';
import JobList from '../components/home/JobList';
import KeyIndustries from '../components/home/KeyIndustries';
import TopCompanies from '../components/home/TopCompanies';


function HomePage() {
    return (
        <>
            <HeroSection />

            <main className="max-w-[1200px] mx-auto px-4">
        <JobList />
        <KeyIndustries />
        <TopCompanies />
      </main>
    </>
    );
}
export default HomePage;
