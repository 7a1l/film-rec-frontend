import { Navigate } from "react-router-dom";
import { useAuthBootstrap } from "../../hooks/use-auth-bootstrap";

export const RootRedirect = () => {
  const user = useAuthBootstrap()

  return <Navigate to={user ? '/films': '/login' } replace/>
}
