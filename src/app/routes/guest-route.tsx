import { Navigate, Outlet } from "react-router-dom";
import { useAuthBootstrap } from "../../hooks/use-auth-bootstrap";

export function GuestRoute() {
    const user = useAuthBootstrap();

    if (user) {
        return <Navigate to="/films" replace/>
    }
    return <Outlet/>
}