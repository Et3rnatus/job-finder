import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import "./App.css";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import JobList from "./components/JobList";
import Footer from "./components/Footer";
import KeyIndustries from "./components/KeyIndustries";
import TopCompanies from "./components/TopCompanies";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <HeroSection />
      <main className="max-w-[1200px] mx-auto px-4">
        <JobList />
        <KeyIndustries />
        <TopCompanies />
      </main>

      <Footer />
    </div>
  );
}

export default App;
