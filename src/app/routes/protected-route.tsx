import { Navigate, Outlet } from "react-router-dom";
import { useAuthBootstrap } from "../../hooks/use-auth-bootstrap";

export function ProtectedRoute() {
    const user = useAuthBootstrap();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}