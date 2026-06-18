import { Navigate, Outlet } from "react-router-dom";
import useUserStore from "@/store/useUserStore";

function hasStoredAuth(): boolean {
  try {
    const stored = localStorage.getItem("user");
    if (!stored) return false;
    const parsed = JSON.parse(stored);
    return Boolean(parsed?.token);
  } catch {
    return false;
  }
}

export default function ProtectedRoute() {
  const { user } = useUserStore();
  const isAuthenticated = Boolean(user?.token) || hasStoredAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
