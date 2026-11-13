import type { ReactNode } from "react";
import { Lock, User } from "lucide-react";

interface AuthFormCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AuthFormCard({ title, description, children }: AuthFormCardProps) {
  // Автоматически подбираем иконку в зависимости от заголовка окна
  const isSecurityScreen =
    title.toLowerCase().includes("пароль") ||
    title.toLowerCase().includes("восстановление") ||
    title.toLowerCase().includes("почт");

  const eyebrowText = isSecurityScreen ? "БЕЗОПАСНОСТЬ АККАУНТА" : "ДОСТУП В MOVIEPICK";

  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-border bg-card/90 p-7 md:p-9 shadow-2xl backdrop-blur-xl transition-colors">
      {/* Иконка в оранжевом квадрате */}
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#FF6B00]/30 bg-[#FF6B00]/10 text-[#FF6B00]">
        {isSecurityScreen ? <Lock className="h-5 w-5" /> : <User className="h-5 w-5" />}
      </div>

      {/* Надзаголовок */}
      <span className="block text-center text-[10px] font-extrabold tracking-widest text-[#FF6B00] uppercase mb-1.5">
        {eyebrowText}
      </span>

      {/* Заголовок и описание */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Содержимое формы */}
      <div className="text-left">
        {children}
      </div>
    </div>
  );
}
