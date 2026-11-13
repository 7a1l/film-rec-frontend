import { useAuthStore } from "@/stores/auth-store";
import { Link, useNavigate } from "react-router-dom"
import { AuthFormCard } from "./auth-form-card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { AuthFormErrorAlert } from "./auth-form-error-alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type SubmitEvent } from "react";

export function LoginForm () {
    const navigate = useNavigate();
    const login = useAuthStore(s => s.login);
    const authError = useAuthStore(s => s.AuthError);
    const isAuthLoading = useAuthStore(s => s.isAuthLoading);


    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const email = String(formData.get('email') ?? '').trim();
        const password = String(formData.get('password') ?? '');

        try {
            await login({ email, password });
            if (localStorage.getItem("is_new_user") === "true") {
                localStorage.removeItem("is_new_user");
                navigate("/onboarding", { replace: true });
            } else {
                navigate("/films", { replace: true });
            }

        } catch {

        }
    } 
    return (
        <div className="flex w-full max-w-sm flex-col gap-6">
            <AuthFormCard title="Вход" description="Введите email и пароль для входа">
                <form onSubmit={handleSubmit}>
                     <FieldGroup>
                        <AuthFormErrorAlert message={ authError }></AuthFormErrorAlert>
                        
                        <Field>
                            <FieldLabel htmlFor="login-email">
                                Email                                
                            </FieldLabel>
                            <Input id="login-email" name="email" type="email" placeholder="example@example.com" autoComplete="email" required disabled={isAuthLoading}></Input>
                        </Field>
                        
                        <Field>
                            <div className="flex justify-between items-center w-full mb-1">
                                <FieldLabel htmlFor="login-password" className="mb-0">
                                    Password                                
                                </FieldLabel>
                                <Link 
                                    to="/recovery"
                                    className="text-xs text-brand-orange hover:text-brand-orange-hover hover:underline font-medium transition-colors"
                                    onClick={() => {
                                        useAuthStore.getState().clearAuthError();
                                    }}
                                >
                                    Забыли пароль?
                                </Link>
                            </div>
                            <Input id="login-password" name="password" type="password" autoComplete="current-password" required disabled={isAuthLoading}></Input>
                        </Field>
                        
                        <Field>
                            <Button type="submit" className="w-full" disabled={isAuthLoading}>
                                { isAuthLoading ? 'Вход...' : 'Войти'}
                            </Button>
                            <FieldDescription className="text-center">
                                Нет аккаунта? {' '}
                                <Link to="/register" className="underline-offset-4 hover:underline" onClick={() => {useAuthStore.getState().clearAuthError()}}> Регистрация</Link>
                            </FieldDescription>
                        </Field>
                     </FieldGroup>
                </form>
            </AuthFormCard>
        </div>
    )
}