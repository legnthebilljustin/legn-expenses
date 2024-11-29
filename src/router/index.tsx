import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Cards, Dashboard, Expenses } from "@/pages";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: "Page not found.",
        children: [
            {
                path: "/dashboard",
                element: <Dashboard />
            },
            {
                path: "/expenses",
                element: <Expenses />
            },
            {
                path: "/cards",
                element: <Cards />
            }
        ]
    },
    {
        path: "/login",
    }
])

export default router