import { AuthScreenLayout } from "../components/auth-screen-layout";
import { ResetPasswordForm } from "../components/reset-password-form";

export function NewPasswordPage() {
    return (
        <AuthScreenLayout>
            <ResetPasswordForm />
        </AuthScreenLayout>
    );
}
