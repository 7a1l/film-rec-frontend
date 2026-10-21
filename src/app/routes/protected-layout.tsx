import { Outlet } from "react-router-dom";

export function ProtectedLayout() {
    return(
        <SidebarProvider>
            <SidebarInset>
                <header className="flex h-12 items-center px-4">
                    <SidebarTrigger/>    
                </header>
                <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col p-4 pt-0">
                        <Outlet/>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}