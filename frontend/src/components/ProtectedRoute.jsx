import { Navigate } from "react-router-dom";
import { getUser } from "../api/client";

// Frontend guards improve UX. The backend checks provide the real security.
export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = getUser();

  if (!token) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/dashboard" replace />;

  return children;
}
