import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./root-layout";
import { RootRedirect } from "./root-redirect";

export const appRouter = createBrowserRouter([{
    path: '/',
    element: <RootLayout />,
    children:
    [
        {
        index: true,
        element: <RootRedirect/>
        }
    ]
}])