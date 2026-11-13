import { useAuthStore } from "@/stores/auth-store";
import { useState, type SubmitEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthFormCard } from "./auth-form-card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { AuthFormErrorAlert } from "./auth-form-error-alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ResetPasswordForm() {
    const navigate = useNavigate();
    const isAuthLoading = useAuthStore(s => s.isAuthLoading);
    const authError = useAuthStore(s => s.AuthError);
    const passwordRecoveryChange  = useAuthStore(s => s.passwordRecoveryChange);
    const [searchParams] = useSearchParams();
    const [localError, setLocalError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLocalError(null);

        const form = event.currentTarget;
        const formData = new FormData(form);
        const password = String(formData.get('password') ?? '');
        const token = searchParams.get("token") || searchParams.get("code") || "";

        try {
            await passwordRecoveryChange({ new_password: password, token: token || "" });
            setIsSuccess(true);
        } catch {
        }
    };

    return (
        <div className="flex w-full max-w-sm flex-col gap-6">
            <AuthFormCard 
                title="Новый пароль" 
                description={isSuccess ? "Пароль изменен" : "Придумайте надежный пароль для защиты вашего аккаунта"}
            >
                {isSuccess ? (
                    <div className="flex flex-col gap-4 text-center select-none">
                        <p className="text-sm text-muted-foreground">
                            Ваш пароль успешно изменен! Теперь вы можете войти в систему, используя новые данные.
                        </p>
                        <Button 
                            type="button" 
                            className="w-full"
                            onClick={() => navigate("/login")}
                        >
                            Войти в аккаунт
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                         <FieldGroup>
                            <AuthFormErrorAlert message={localError || authError} />
                            
                            <Field>
                                <FieldLabel htmlFor="reset-password">
                                    Новый пароль                              
                                </FieldLabel>
                                <Input 
                                    id="reset-password" 
                                    name="password" 
                                    type="password" 
                                    placeholder="••••••••" 
                                    required 
                                    disabled={isAuthLoading}
                                />
                            </Field>
                            
                            <Field>
                                <FieldLabel htmlFor="reset-confirm-password">
                                    Повторите пароль                             
                                </FieldLabel>
                                <Input 
                                    id="reset-confirm-password" 
                                    name="confirm-password" 
                                    type="password" 
                                    placeholder="••••••••" 
                                    required 
                                    disabled={isAuthLoading}
                                />
                            </Field>
                            
                            <Field className="mt-2">
                                <Button type="submit" className="w-full" disabled={isAuthLoading}>
                                    {isAuthLoading ? 'Сохранение...' : 'Сохранить пароль'}
                                </Button>
                                
                                <FieldDescription className="text-center mt-4">
                                    Вспомнили пароль?{' '}
                                    <Link 
                                        to="/login" 
                                        className="underline-offset-4 hover:underline font-semibold"
                                        onClick={() => useAuthStore.getState().clearAuthError()}
                                    > 
                                        Войти
                                    </Link>
                                </FieldDescription>
                            </Field>
                         </FieldGroup>
                    </form>
                )}
            </AuthFormCard>
        </div>
    );
}
