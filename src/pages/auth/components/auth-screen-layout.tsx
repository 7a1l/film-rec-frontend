import type { ReactNode } from "react";
import { Shield } from "lucide-react";
import { BrandLogo } from "@/components/app-header";

export function AuthScreenLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-background text-foreground transition-colors">
      {/* Фоновая сетка в клеточку */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20 dark:opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(128,128,128,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(128,128,128,0.15) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(circle, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(circle, black 40%, transparent 80%)",
        }}
      />

      {/* Световые оранжевые блики */}
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-[#FF6B00]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-[#FF6B00]/10 blur-3xl" />

      {/* Верхняя шапка с логотипом */}
      <header className="relative z-10 flex h-[72px] w-full items-center justify-between border-b border-border px-6 md:px-10">
        <BrandLogo />
      </header>

      {/* Центральная область для карточки формы */}
      <main className="relative z-10 flex flex-1 items-center justify-center p-4 my-6">
        {children}
      </main>

      {/* Нижний футер безопасности */}
      <footer className="relative z-10 flex min-h-[60px] w-full items-center justify-between border-t border-border/50 px-6 md:px-10 text-[11px] text-muted-foreground">
        <span className="hidden sm:flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-[#FF6B00]" />
          <span>Ваша информация зашифрована и надёжно защищена</span>
        </span>
        <span className="mx-auto sm:mx-0">© 2026 MOVIEPICK</span>
      </footer>
    </div>
  );
}
