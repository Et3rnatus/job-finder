import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "./App.css";

/* =====================
   LAYOUT
===================== */
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

/* =====================
   PAGES
===================== */
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";

import CandidatePage from "./pages/CandidatePage";
import EmployerPage from "./pages/EmployerPage";
import EmployerApplicantsPage from "./pages/EmployerApplicantsPage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";
import SavedJobListPage from "./pages/SavedJobListPage";

/* =====================
   CANDIDATE SUB PAGES
===================== */
import AppliedJobList from "./components/candidate/AppliedJobList";

function App() {
  /* =====================
     INIT AOS
  ===================== */
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        {/* =====================
            GLOBAL NAVBAR
        ===================== */}
        <Navbar />

        {/* =====================
            ROUTES
        ===================== */}
        <main className="flex-1">
          <Routes>
            {/* ===== PUBLIC ===== */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ===== JOBS ===== */}
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />

            {/* ===== CANDIDATE ===== */}
            <Route path="/account/candidate" element={<CandidatePage />} />
            <Route
              path="/candidate/applications"
              element={<AppliedJobList />}
            />
            <Route
              path="/candidate/saved-jobs"
              element={<SavedJobListPage />}
            />

            {/* ===== EMPLOYER ===== */}
            <Route path="/account/employer" element={<EmployerPage />} />
            <Route
              path="/employer/jobs/:jobId/applications"
              element={<EmployerApplicantsPage />}
            />
            <Route
              path="/employer/applications/:applicationId"
              element={<ApplicationDetailPage />}
            />
          </Routes>
        </main>

        {/* =====================
            GLOBAL FOOTER
        ===================== */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
