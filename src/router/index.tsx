import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Cards, Dashboard, Expenses, Unauthorized } from "@/pages";
import Login from "@/pages/Login";
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
            }
        ]
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/403",
        element: <Unauthorized />
    }
])

export default router