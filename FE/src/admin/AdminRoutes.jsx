import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoutes() {
  const role = localStorage.getItem("role");

  if (role !== "admin") {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
