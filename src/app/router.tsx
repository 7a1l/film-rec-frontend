import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./routes/root-layout";
import { RootRedirect } from "./routes/root-redirect";
import { GuestRoute } from "./routes/guest-route";
import { ProtectedRoute } from "./routes/protected-route";

export const appRouter = createBrowserRouter([{
    path: '/',
    element: <RootLayout />,
    children:
    [
        {
            index: true,
            element: <RootRedirect/>
        },
        {
            element: <GuestRoute/>,
            children: [
                {
                    path: "login",
                    element: <h1>Login</h1>
                },
                {
                    path: "register",
                    element: <h1>Register</h1>
                }
            ]
        },
        {
            element: <ProtectedRoute/>,
            children: [
                {
                    path: "recomendations",
                    element: <h1>recomendations</h1>
                },
                {
                    path: "rating",
                    element: <h1>rating</h1>
                },
            ]
        },
        {
            path: "*",
            element: <Navigate to="/" replace/>
        }
    ]
}])