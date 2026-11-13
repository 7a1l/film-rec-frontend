import { useAuthStore } from "@/stores/auth-store";
import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthFormCard } from "./auth-form-card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { AuthFormErrorAlert } from "./auth-form-error-alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function RecoveryForm() {
    const navigate = useNavigate();

    const authError = useAuthStore(s => s.AuthError);
    const isAuthLoading = useAuthStore(s => s.isAuthLoading);
    const sendRecoveryEmail = useAuthStore(s => s.sendRecoveryEmail);
    const [isSuccessSent, setIsSuccessSent] = useState(false);

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const email = String(formData.get('email') ?? '').trim();

        try {
            await sendRecoveryEmail({ email });
            setIsSuccessSent(true);
        } catch {
        }
    };

    return (
        <div className="flex w-full max-w-sm flex-col gap-6">
            <AuthFormCard 
                title="Восстановление" 
                description={isSuccessSent ? "Инструкции отправлены" : "Введите email для сброса пароля"}
            >
                {isSuccessSent ? (
                    <div className="flex flex-col gap-4 text-center select-none">
                        <p className="text-sm text-muted-foreground">
                            Ссылка для восстановления пароля была успешно отправлена на вашу почту. Проверьте ваш почтовый ящик.
                        </p>
                        <Button 
                            type="button" 
                            className="w-full"
                            onClick={() => navigate("/login")}
                        >
                            Вернуться ко входу
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <AuthFormErrorAlert message={authError} />
                            
                            <Field>
                                <FieldLabel htmlFor="recovery-email">
                                    Email                                
                                </FieldLabel>
                                <Input 
                                    id="recovery-email" 
                                    name="email" 
                                    type="email" 
                                    placeholder="example@example.com" 
                                    autoComplete="email" 
                                    required 
                                    disabled={isAuthLoading}
                                />
                            </Field>
                            
                            <Field className="mt-2">
                                {/* Кнопка 2: Отправка формы (Чистый стиль, как в LoginForm) */}
                                <Button 
                                    type="submit" 
                                    className="w-full" 
                                    disabled={isAuthLoading}
                                >
                                    {isAuthLoading ? 'Отправка...' : 'Получить ссылку'}
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
