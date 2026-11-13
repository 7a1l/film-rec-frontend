import { AppSideBar } from "@/components/app-sidebar/app-sidebar";
import { Outlet } from "react-router-dom";

export function ProtectedLayout() {
    return(
       <div className="flex min-h-screen w-full bg-[#121214] text-foreground font-sans">
      <AppSideBar />
      <main className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </main>
    </div>

    )
}