import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ allowedRoles }) {
  const { loading, isAuthenticated, user } = useAuth();

    if (loading) return <p>Loading...</p>;
    console.log("isAuthenticated", isAuthenticated);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

//   if (isAuthenticated && allowedRoles === user?.user_role) return <Navigate to="/unauthorized" replace />
 if ( allowedRoles && allowedRoles !== user?.role) return <Navigate to="/unauthorized" replace />
  return <Outlet />;
}
