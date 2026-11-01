import { Link } from "react-router-dom";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Calendar, Calendar1Icon } from "lucide-react";

export function AppSidebarBrand() {
    return (
        <SidebarMenu className="gap-2 px-1">
            <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                    <Link to="/films" className="gap-2">
                        <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <Calendar1Icon/>
                        </span>
                        <span className="font-heading font-semibold">
                            Films
                        </span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}