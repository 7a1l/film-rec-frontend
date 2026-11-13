import { Outlet } from "react-router-dom";
import { ThemeToggleFloating } from "@/components/theme-toggle-floating";

export function RootLayout() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <Outlet />
      <ThemeToggleFloating />
    </div>
  );
}
