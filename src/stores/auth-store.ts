import {create} from 'zustand'
import type { AuthLoginRequest, AuthRegisterRequest, UserPublic } from '../shared/api/types'
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
}

function profileToUser(profile: { id: string, email: string }): UserPublic {
    return { id: profile.id, email: profile.email }
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
        set({isAuthLoading: true, AuthError: null})
        try { 
            const { token, user } = await authApi.login(payload);

            setAuthToken(token);
            set({
                user, 
                isAuthLoading: false 
            })
        } catch (error){
            set({ 
                isAuthLoading: false, 
                AuthError: getApiErrorMessage(error, 'Не удалось войти')
            })
            throw error
        }
    },
    register: async (payload) => {
        set({isAuthLoading: true, AuthError: null})
         try { 
            const { token, user } = await authApi.register(payload);

            setAuthToken(token);
            set({
                user, 
                isAuthLoading: false 
            })
        } catch (error){
            set({ 
                isAuthLoading: false, 
                AuthError: getApiErrorMessage(error, 'Не удалось зарегистрироваться')
            })
            throw error
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
    }
}))