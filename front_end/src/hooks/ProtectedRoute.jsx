import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ allowedRoles }) {
  const { loading, isAuthenticated, user } = useAuth();
  const userRole = user?.role.toLowerCase();
    if (loading) return <p>Loading...</p>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

//   if (isAuthenticated && allowedRoles === user?.user_role) return <Navigate to="/unauthorized" replace />
 if ( allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to="/unauthorized" replace />
  return <Outlet />;
}
