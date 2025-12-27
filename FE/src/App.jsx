import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import "./App.css";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";  
import RegisterPage from "./pages/RegisterPage";
import CandidatePage from "./pages/CandidatePage";
import JobDetailPage from "./pages/JobDetailPage";
import EmployerPage from "./pages/EmployerPage";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return (
    <Router>
      <div className="bg-white min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />

          <Route path="/account">
            <Route path="candidate" element={<CandidatePage />} />
            <Route path="employer" element={<EmployerPage />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
