import axios, { AxiosError } from "axios";
import { getAuthToken } from "./auth-token";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
    throw new Error("VITE_API_URL не задан в .env!")
}

export const http = axios.create({
    baseURL,
    headers: {
        "Content-Type": 'application/json'
    }
})

http.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token)
    {
        config.headers.Authorization = 'Bearer ${token}'
    }
    return config;
})

export type ApiValidationError = {
    message: string;
    errors: Array<{path: string, message: string}>
}

export function isAxiosError<T = unknown>(e: unknown): e is AxiosError<T> {
    return axios.isAxiosError(e)
}

