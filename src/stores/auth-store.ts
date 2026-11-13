import {create} from 'zustand'
import type { AuthLoginRequest, AuthRegisterRequest, PasswordRecoveryChangeRequest, PasswordRecoveryRequest, PasswordUpdateRequest, UserPublic, UserUpdateRequest } from '../shared/api/types'
import { getAuthToken, setAuthToken } from '../shared/api/auth-token'
import { authApi } from '../shared/api/auth-api'
import { getApiErrorMessage } from '../lib/utils'

type AuthState = {
    user: UserPublic | null
    bootstraped: boolean
    isAuthLoading: boolean
    AuthError: string | null

    bootstrap: () => Promise<void>
    login: (payload: AuthLoginRequest) => Promise<void>
    register: (payload: AuthRegisterRequest) => Promise<void>
    logout: () => void
    clearAuthError: () => void
    featchMe: () => Promise<void>
    sendRecoveryEmail: (email: PasswordRecoveryRequest) => Promise<void> 
    passwordRecoveryChange: (payload: PasswordRecoveryChangeRequest) => Promise<void>
    updateProfile: (payload: UserUpdateRequest) => Promise<void>
    confirmEmailChange: (token: string) => Promise<void>
    updatePassword: (payload: PasswordUpdateRequest) => Promise<void>
}

function profileToUser(profile: { id: string, email: string, name: string }): UserPublic {
    return { id: profile.id, email: profile.email, name: profile.name }
}


export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    bootstraped: false,
    isAuthLoading: false,
    AuthError: null,
    bootstrap: async () => {
        if (get().bootstraped)
        {
            return
        }
        set({isAuthLoading: true, AuthError: null})
        try 
        {
            if (!getAuthToken())
            {
                set({user: null, bootstraped:  true, isAuthLoading: false})
                return
            }
            const profile = await authApi.me();
            set({
                user: profileToUser(profile),
                bootstraped: true,
                isAuthLoading: false
            })

        } catch(error) {
            setAuthToken(null)
            set({
                user: null,
                bootstraped: true,
                isAuthLoading: false
            })
        }        
    },
    login: async (payload) => {
        set({ isAuthLoading: true, AuthError: null });
        try { 
            const response = await authApi.login(payload);
            setAuthToken(response.JWT_token);
            await get().featchMe();
            
            set({ isAuthLoading: false });
        } catch (error) {
            set({ 
                isAuthLoading: false, 
                AuthError: getApiErrorMessage(error, 'Не удалось войти')
            });
            throw error;
        }
    },

    register: async (payload) => {
        set({ isAuthLoading: true, AuthError: null });
        try { 
            await authApi.register(payload);
            set({ isAuthLoading: false });
        } catch (error) {
            set({ 
                isAuthLoading: false, 
                AuthError: getApiErrorMessage(error, 'Не удалось зарегистрироваться')
            });
            throw error;
        }
    },
    logout: async () => {
        setAuthToken(null);
        set({ user: null, AuthError: null})
    },
    clearAuthError: () => {
        set({AuthError: null})
    },
    featchMe: async () => {
        if (!getAuthToken()){
            set({user: null})
            return
        }
        try {
            const profile = await authApi.me();
            set({user: profileToUser(profile)})
        } catch (error)
        {
            setAuthToken(null);
            set({user: null})
        }
    },
    sendRecoveryEmail: async (email) => {
        set({ isAuthLoading: true, AuthError: null })
        try {
            await authApi.sendRecoveryEmail(email); 
            set({ isAuthLoading: false })
        } catch (error) {
            set({
                isAuthLoading: false,
                AuthError: getApiErrorMessage(error, 'Не удалось отправить ссылку для восстановления')
            })
            throw error
        }
    },
    passwordRecoveryChange: async (payload) => {
        set({ isAuthLoading: true, AuthError: null })
        try {
            await authApi.passwordRecoveryChange(payload)
            set({ isAuthLoading: false })
        } catch (error) {
            set({
                isAuthLoading: false,
                AuthError: getApiErrorMessage(error, 'Не удалось изменить пароль. Возможно, ссылка устарела')
            })
            throw error
        }
    },
    updateProfile: async (payload) => {
        set({ isAuthLoading: true, AuthError: null })
        try {
            const updatedUser = await authApi.updateProfile(payload)
            set({ 
                user: profileToUser(updatedUser), 
                isAuthLoading: false 
            })
        } catch (error) {
            set({
                isAuthLoading: false,
                AuthError: getApiErrorMessage(error, 'Не удалось обновить профиль')
            })
            throw error
        }
    },

    confirmEmailChange: async (token) => {
        set({ isAuthLoading: true, AuthError: null })
        try {
            await authApi.confirmEmailChange(token)
            await get().featchMe()
            set({ isAuthLoading: false })
        } catch (error) {
            set({
                isAuthLoading: false,
                AuthError: getApiErrorMessage(error, 'Не удалось подтвердить смену почты. Ссылка недействительна')
            })
            throw error
        }
    },
    updatePassword: async (payload) => {
        set({ isAuthLoading: true, AuthError: null })
        try {
            await authApi.updatePassword(payload)
            set({ isAuthLoading: false })
        } catch (error) {
            set({
                isAuthLoading: false,
                AuthError: getApiErrorMessage(error, 'Не удалось обновить пароль. Проверьте старый пароль')
            })
            throw error
        }
    }

}))