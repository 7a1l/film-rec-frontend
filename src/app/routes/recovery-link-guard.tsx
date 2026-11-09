import { useEffect, useState } from "react";
import { Navigate, Outlet, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";
import { AuthFormCard } from "@/pages/auth/components/auth-form-card";
import { Button } from "@/components/ui/button";
import { AuthScreenLayout } from "@/pages/auth/components/auth-screen-layout";

export function RecoveryLinkGuard() {
    const [searchParams] = useSearchParams();
    const validateResetToken = useAuthStore(s => s.validateResetToken);
    
    const [isValidating, setIsValidating] = useState(true);
    const [isTokenValid, setIsTokenValid] = useState(false);

    const token = searchParams.get("token") || searchParams.get("code");

    useEffect(() => {
        if (!token) {
            setIsValidating(false);
            setIsTokenValid(false);
            return;
        }

        const checkToken = async () => {
            try {
                await validateResetToken({token});
                setIsTokenValid(true);
            } catch (error) {
                setIsTokenValid(false);
            } finally {
                setIsValidating(false);
            }
        };

        checkToken();
    }, [token, validateResetToken]);

    if (isValidating) {
        return (
            <AuthScreenLayout>
                <div className="text-center text-muted-foreground animate-pulse">
                    Проверка безопасности ссылки...
                </div>
            </AuthScreenLayout>
        );
    }
    if (!isTokenValid) {
        return (
            <AuthScreenLayout>
                <div className="flex w-full max-w-sm flex-col gap-6">
                    <AuthFormCard title="Ошибка доступа" description="Ссылка устарела">
                        <div className="flex flex-col gap-4 text-center select-none">
                            <p className="text-sm text-muted-foreground">
                                Эта ссылка для восстановления пароля устарела, уже была использована или является недействительной. 
                                Запросите восстановление пароля заново.
                            </p>
                            <Button 
                                type="button" 
                                className="w-full"
                                onClick={() => window.location.href = '/recovery'}
                            >
                                Перейти к восстановлению
                            </Button>
                        </div>
                    </AuthFormCard>
                </div>
            </AuthScreenLayout>
        );
    }

    return <Outlet />;
}
