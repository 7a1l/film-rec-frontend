import { isAxiosError } from "axios";
import type { ApiErrorResponse } from "../shared/api/types";
import { clsx,  type ClassValue } from "cn";
import { twMerge } from "tailwind-merge"

export function getApiErrorMessage(error: unknown, fallback = 'Что-то пошло не так'): string {
    if (isAxiosError<ApiErrorResponse>(error))
    {
        const data = error.response?.data;
        if (data && typeof data.message === 'string')
        {
            return data.message
        }
    }
    
    if (error instanceof Error)
    {
        return error.message 
    }
    return fallback
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}