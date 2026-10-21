import { http } from "./http";
import type { AuthLoginRequest, AuthRegisterRequest, AuthResponse, UserProfile } from "./types";

export const authApi = {
    async login(payload: AuthLoginRequest): Promise<AuthResponse> {
        const { data } = await http.post<AuthResponse>('/auth/login', payload);

        return data;
    },
    async register(payload: AuthRegisterRequest): Promise<AuthResponse> {
        const { data } = await http.post<AuthResponse>('/auth/register', payload);
        
        return data;
    },
    async me(): Promise<UserProfile> {
         const { data } = await http.get<UserProfile>('/user/me');

         return data;
    }
}
