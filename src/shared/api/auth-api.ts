import { http } from "./http";
import type { AuthLoginRequest, AuthRegisterRequest, AuthResponse, PasswordRecoveryChangeRequest, PasswordRecoveryRequest, PasswordRecoveryResponse, PasswordUpdateRequest, RegisterResponse, UserProfile, UserPublic, UserUpdateRequest } from "./types";

export const authApi = {

    async login(payload: AuthLoginRequest): Promise<AuthResponse> {
        const { data } = await http.post<AuthResponse>('/user/login', payload);
        return data;
    },
     async register(payload: AuthRegisterRequest): Promise<RegisterResponse> {
        const { data } = await http.post<RegisterResponse>('/user/sign-up', payload);
        return data;
    },
    async me(): Promise<UserProfile> {
         const { data } = await http.get<UserProfile>('/user/me');
         return data;
    },
    async sendRecoveryEmail(email: PasswordRecoveryRequest): Promise<PasswordRecoveryResponse> {
        const { data } = await http.post<PasswordRecoveryResponse>('/user/password-recovery', email); 
        return data;
    },
    async passwordRecoveryChange(payload: PasswordRecoveryChangeRequest): Promise<void> {
        const { new_password, token } = payload;
        await http.patch('/user/password-recovery-change', 
            { new_password }, 
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
    },
    async updateProfile(payload: UserUpdateRequest): Promise<UserPublic> {
        const { data } = await http.patch<UserPublic>('/user/profile-update', payload);
        return data;
    },

    async confirmEmailChange(token: string): Promise<void> {
        await http.patch('/user/confirm-email-change', 
            {},
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
    },
    async updatePassword(payload: PasswordUpdateRequest): Promise<void> {
        await http.patch('/user/password-update', payload);
    }
}
