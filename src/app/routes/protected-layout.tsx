import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppHeader } from "@/components/app-header";
import { AppSideBar } from "@/components/app-sidebar/app-sidebar";

export function ProtectedLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <AppHeader onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
      
      <div className="flex flex-1">
        <AppSideBar 
          mobileOpen={mobileMenuOpen} 
          onCloseMobile={() => setMobileMenuOpen(false)} 
        />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}