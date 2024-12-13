import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Cards, Dashboard, Expenses, Login, Register, Unauthorized } from "@/pages";
import { ProtectedRoute } from "@/components";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: "Page not found.",
        children: [
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/login",
                element: <Login />
            },
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
            }
        ]
    },
    {
        path: "/403",
        element: <Unauthorized />
    }
])

export default router