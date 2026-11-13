import { AuthScreenLayout } from "@/pages/auth/components/auth-screen-layout";
import { ProfileForm } from "./components/profile-form";

export function ProfilePage() {
    return (
        <AuthScreenLayout>
            <ProfileForm />
        </AuthScreenLayout>
    );
}
