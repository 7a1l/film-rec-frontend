import { useAuthStore } from "@/stores/auth-store"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from "../ui/sidebar";
import { AppSidebarBrand } from "./app-sidebar-brand";

export function AppSideBar() {
    const user = useAuthStore(s => s.user);
    const logout = useAuthStore(s => s.logout);
    const { state } = useSidebar();

    if (!user) {
        return null;
    }

    return (
        <Sidebar collapsible="icon"> 
            <SidebarHeader className="border-b border-sidebar-border p-3">
                <AppSidebarBrand/>
            </SidebarHeader>
            <SidebarContent>

            </SidebarContent>
            <SidebarFooter>

            </SidebarFooter>
        </Sidebar>
    )
}