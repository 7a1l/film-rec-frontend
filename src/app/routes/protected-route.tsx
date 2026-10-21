import { Navigate } from "react-router-dom";
import { useAuthBootstrap } from "../../hooks/use-auth-bootstrap";
import { ProtectedLayout } from "./protected-layout";

export function ProtectedRoute() {
    const user = useAuthBootstrap();

    if (!user) {
        return <Navigate to="/login" replace/>
    }
    return <ProtectedLayout/>
}