import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute() {
  const { user } = useAuth();

  const token = localStorage.getItem("accessToken");

  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
