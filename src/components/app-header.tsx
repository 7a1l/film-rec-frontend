import { Link } from "react-router-dom";
import { Search, ChevronRight, Menu } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

export function BrandLogo() {
  return (
    <Link to="/films" className="inline-flex items-center gap-2.5 select-none group">
      <span className="relative flex h-7 w-7 items-center justify-center rounded-full rounded-bl-sm border-2 border-[#FF6B00] -rotate-12 transition-transform group-hover:rotate-0">
        <span className="absolute top-1 left-1.5 h-1 w-1 rounded-full bg-[#FF6B00]" />
        <span className="absolute top-1.5 right-1 h-1 w-1 rounded-full bg-[#FF6B00]" />
        <span className="absolute bottom-1 left-2.5 h-1 w-1 rounded-full bg-[#FF6B00]" />
      </span>
      <span className="text-lg font-extrabold tracking-tight text-foreground">
        MOVIE<span className="text-[#FF6B00]">PICK</span>
      </span>
    </Link>
  );
}

interface AppHeaderProps {
  onToggleMobileMenu?: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export function AppHeader({ onToggleMobileMenu, searchQuery = "", onSearchChange }: AppHeaderProps) {
  const user = useAuthStore((s) => s.user);
  const initials = (user?.name || user?.email || "U").slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex h-[72px] w-full items-center justify-between gap-4 border-b border-border bg-background/85 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Открыть меню"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <BrandLogo />
      </div>

      {/* Поиск */}
      {onSearchChange && (
        <div className="hidden sm:flex relative w-full max-w-md items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск фильмов, жанров, актёров..."
            className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-[#FF6B00]"
          />
        </div>
      )}

      {/* Профиль справа */}
      <Link
        to="/user/me"
        className="flex items-center gap-3 rounded-xl border border-transparent hover:border-border hover:bg-card px-2.5 py-1.5 transition-all"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FF6B00]/40 bg-[#FF6B00]/15 text-xs font-extrabold text-[#FF6B00]">
          {initials}
        </div>
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-bold leading-none text-foreground">
            {user?.name || "Пользователь"}
          </span>
          <span className="text-[10px] text-muted-foreground mt-1">
            {user?.email}
          </span>
        </div>
        <ChevronRight className="hidden md:block h-4 w-4 text-muted-foreground" />
      </Link>
    </header>
  );
}
