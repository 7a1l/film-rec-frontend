import { http } from "./http";
import type { AuthLoginRequest, AuthRegisterRequest, AuthResponse, NewPasswordRequest, PasswordRecoveryRequest, PasswordRecoveryResponse, UserProfile, ValidateTokenRequest } from "./types";

export const authApi = {
    async login(payload: AuthLoginRequest): Promise<AuthResponse> {
        const { data } = await http.post<AuthResponse>('/user/login', payload);

        return data;
    },
    async register(payload: AuthRegisterRequest): Promise<AuthResponse> {
        const { data } = await http.post<AuthResponse>('/user/sign-up', payload);
        
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
    async updatePassword(password: NewPasswordRequest): Promise<PasswordRecoveryResponse> {
        const { data } = await http.post('/user/password-update', { password }); 

        return data;
    },
    async validateResetToken(token: ValidateTokenRequest): Promise<PasswordRecoveryResponse> {
        const { data } = await http.get('/user/validate-reset-token', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        return data;
    }
}
