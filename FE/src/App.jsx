import { useEffect } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster, toast } from "react-hot-toast";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import "./App.css";

/* =====================
   LAYOUT
===================== */
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AdminLayout from "./components/layout/AdminLayout";

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
import ViewedJobList from "./components/candidate/ViewedJobList";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* =====================
   ADMIN PAGES
===================== */
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminJobsPage from "./pages/admin/AdminJobsPage";
import AdminCategoryPage from "./pages/admin/AdminCategoryPage";
import AdminPaymentPage from "./pages/admin/AdminPaymentPage";

/* =====================
   CANDIDATE SUB PAGES
===================== */
import AppliedJobList from "./components/candidate/AppliedJobList";

/* =====================
   USER LAYOUT
===================== */
function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/* =====================
   ADMIN GUARD
===================== */
function AdminGuard() {
  const role = localStorage.getItem("role");

  if (role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

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

  /* =====================
     AXIOS GLOBAL INTERCEPTOR
  ===================== */
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (
          status === 401 &&
          message === "Tài khoản đã bị khóa"
        ) {
          localStorage.clear();

          toast.error(
            "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên."
          );

          setTimeout(() => {
            window.location.href = "/login";
          }, 1500);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <>
      {/* 🔥 TOAST GLOBAL */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "14px",
          },
        }}
      />

      <Router>
        <Routes>
          {/* ===== USER (CÓ NAVBAR + FOOTER) ===== */}
          <Route element={<UserLayout />}>
            {/* PUBLIC */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* JOBS */}
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />

            {/* CANDIDATE */}
            <Route
              path="/account/candidate"
              element={<CandidatePage />}
            />
            <Route
              path="/candidate/applications"
              element={<AppliedJobList />}
            />
            <Route
              path="/candidate/saved-jobs"
              element={<SavedJobListPage />}
            />
            <Route
              path="/candidate/viewed-jobs"
              element={<ViewedJobList />}
            />

            {/* EMPLOYER */}
            <Route
              path="/account/employer"
              element={<EmployerPage />}
            />
            <Route
              path="/employer/jobs/:jobId/applications"
              element={<EmployerApplicantsPage />}
            />
            <Route
              path="/employer/applications/:applicationId"
              element={<ApplicationDetailPage />}
            />
            <Route
              path="/payment-success"
              element={<PaymentSuccessPage />}
            />
          </Route>

          {/* ===== ADMIN ===== */}
          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="jobs" element={<AdminJobsPage />} />
              <Route
                path="categories"
                element={<AdminCategoryPage />}
              />
              <Route
                path="payment"
                element={<AdminPaymentPage />}
              />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
