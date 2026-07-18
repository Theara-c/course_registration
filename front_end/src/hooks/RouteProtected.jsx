import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

export default function RoleRoute({ allowedRoles }) {

    const { user } = useAuth();

    if (!allowedRoles.includes(user.user_role))
        return <Navigate to="/403" replace />;

    return <Outlet />;
}