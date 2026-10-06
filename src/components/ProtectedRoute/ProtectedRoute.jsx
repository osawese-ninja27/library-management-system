import { Navigate, Outlet } from "react-router-dom";
import { getToken, getUser } from "../../utils/auth";

// Wraps routes that need a logged-in user. Pass adminOnly for admin pages.
export default function ProtectedRoute({ adminOnly = false }) {
  const token = getToken();
  const user = getUser();

  if (!token || !user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/discover" replace />;
  if (!adminOnly && user.role === "admin") return <Navigate to="/admin/books" replace />;

  return <Outlet />;
}
