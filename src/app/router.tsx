import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./routes/root-layout";
import { RootRedirect } from "./routes/root-redirect";
import { GuestRoute } from "./routes/guest-route";
import { ProtectedRoute } from "./routes/protected-route";
import { AuthRegisterPage } from "@/pages/auth/register/page";
import { AuthLoginPage } from "@/pages/auth/login/page";
import { PasswordrecoveryPage } from "@/pages/auth/recovery/page";
import { NewPasswordPage } from "@/pages/auth/new-password/page";
import { RecoveryLinkGuard } from "./routes/recovery-link-guard";
import { ProtectedLayout } from "./routes/protected-layout";
import { ConfirmEmailPage } from "@/pages/auth/confirm-email-change/page";
import { ProfilePage } from "@/pages/profile/page";
import { FilmsPage } from "@/pages/films/page";
import { OnboardingPage } from "@/pages/onboarding/page";

export const appRouter = createBrowserRouter([{
    path: '/',
    element: <RootLayout />,
    children:
    [
        {
            index: true,
            element: <RootRedirect/>
        },
        { path: "confirm-email", element: <ConfirmEmailPage /> },
        {
            element: <GuestRoute/>,
            children: [
                { path: "login", element: <AuthLoginPage/> },
                { path: "recovery", element: <PasswordrecoveryPage/> },
                { path: "register", element: <AuthRegisterPage/> }
            ]
        },

        {
            element: <RecoveryLinkGuard />,
            children: [
                  { path: "reset-password", element: <NewPasswordPage /> }
                ]
        },
      {
            element: <ProtectedRoute />,
            children: [
                { path: "user/me", element: <ProfilePage /> },
                { path: "onboarding", element: <OnboardingPage /> },                
                {
                    element: <ProtectedLayout />,
                    children: [
                        { path: "films", element: <FilmsPage /> },
                        { path: "recomendations", element: <h1/> }
                    ]
                }
            ]
        },
        {
            path: "*",
            element: <Navigate to="/" replace/>
        }
    ]
}])