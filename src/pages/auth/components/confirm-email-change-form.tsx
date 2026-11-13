import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";
import { AuthScreenLayout } from "../components/auth-screen-layout";
import { AuthFormCard } from "../components/auth-form-card";
import { Button } from "@/components/ui/button";

export function ConfirmEmailForm() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const confirmEmailChange = useAuthStore(s => s.confirmEmailChange);
    const authError = useAuthStore(s => s.AuthError);
    const user = useAuthStore(s => s.user);

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const isCalledRef = useRef(false);

    useEffect(() => {
        if (isCalledRef.current) return;
        
        const token = searchParams.get("token");

        if (!token) {
            setStatus('error');
            return;
        }

        isCalledRef.current = true;

        const verifyEmail = async () => {
            try {
                await confirmEmailChange(token);
                setStatus('success');
            } catch {
                setStatus('error');
            }
        };

        verifyEmail();
    }, [searchParams, confirmEmailChange]);

    return (
        <AuthScreenLayout>
            <div className="flex w-full max-w-sm flex-col gap-6">
                <AuthFormCard 
                    title={
                        status === 'loading' ? "Подтверждение..." : 
                        status === 'success' ? "Почта обновлена!" : "Ошибка подтверждения"
                    }
                    description={
                        status === 'loading' ? "Пожалуйста, подождите, проверяем вашу ссылку" : 
                        status === 'success' ? "Ваш новый email успешно привязан к аккаунту" : "Не удалось подтвердить новый адрес"
                    }
                >
                    <div className="flex flex-col gap-4 text-center select-none">
                        {status === 'loading' && (
                            <p className="text-sm text-muted-foreground animate-pulse py-4">
                                Связываемся с сервером...
                            </p>
                        )}

                        {status === 'success' && (
                            <>
                                <p className="text-sm text-muted-foreground">
                                    Теперь для входа в систему и получения уведомлений будет использоваться ваша новая почта.
                                </p>
                                <Button 
                                    type="button" 
                                    className="w-full"
                                    onClick={() => navigate(user ? "/user/me" : "/login", { replace: true })}
                                >
                                    {user ? "Вернуться в профиль" : "Войти в аккаунт"}
                                </Button>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <p className="text-sm text-destructive">
                                    {authError || "Ссылка недействительна, устарела или токен отсутствует."}
                                </p>
                                <Button 
                                    type="button" 
                                    className="w-full"
                                    onClick={() => navigate(user ? "/user/me" : "/login", { replace: true })}
                                >
                                    {user ? "В личный кабинет" : "На страницу входа"}
                                </Button>
                            </>
                        )}
                    </div>
                </AuthFormCard>
            </div>
        </AuthScreenLayout>
    );
}
