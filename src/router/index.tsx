import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Cards, Crypto, Dashboard, Expenses, Login, Register, Unauthenticated, Unauthorized } from "@/pages";
import { ProtectedRoute } from "@/components";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: "Page not found.",
        children: [
            {
                path: "/dashboard",
                element: <ProtectedRoute><Dashboard /></ProtectedRoute>
            },
            {
                path: "/expenses",
                element: <ProtectedRoute><Expenses /></ProtectedRoute>
            },
            {
                path: "/cards",
                element: <ProtectedRoute><Cards /></ProtectedRoute>
            },
            {
                path: "/crypto",
                element: <ProtectedRoute><Crypto /></ProtectedRoute>
            }
        ]
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/403",
        element: <Unauthorized />
    },
    {
        path: "/401",
        element: <Unauthenticated />
    }
])

export default router