import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggleFloating() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "system") setTheme("dark");
    else if (theme === "dark") setTheme("light");
    else setTheme("system");
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      title="Сменить тему оформления"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-card/90 backdrop-blur-md border border-border px-3.5 py-2.5 text-xs font-semibold text-foreground shadow-xl transition-all hover:border-[#FF6B00] hover:scale-105 active:scale-95 cursor-pointer"
    >
      {theme === "dark" && <Moon className="h-4 w-4 text-[#FF6B00]" />}
      {theme === "light" && <Sun className="h-4 w-4 text-[#FF6B00]" />}
      {theme === "system" && <Monitor className="h-4 w-4 text-[#FF6B00]" />}
      <span className="hidden sm:inline">
        {theme === "system" ? "Системная" : theme === "dark" ? "Тёмная" : "Светлая"}
      </span>
    </button>
  );
}
