import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";

type AuthFormCardProps = {
    title: String;
    children: ReactNode;
    description?: string; 
}

export function AuthFormCard({title, children, description}: AuthFormCardProps) {
    return (
        <Card>
            <CardHeader> 
                <CardTitle> { title } </CardTitle>
                { description && <CardDescription> { description }</CardDescription> }
            </CardHeader>
            <CardContent>
                { children }
            </CardContent>
        </Card>
    )
}