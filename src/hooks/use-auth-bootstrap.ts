import { use } from "react";
import { useAuthStore } from "../stores/auth-store";
import { ensureAuthBootstraped } from "../app/auth-bootstrap";

export function useAuthBootstrap() {
    use(ensureAuthBootstraped()) 

    return useAuthStore(state => state.user)
}