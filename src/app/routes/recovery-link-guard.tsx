import { Navigate, Outlet, useSearchParams } from "react-router-dom";

export function RecoveryLinkGuard() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}