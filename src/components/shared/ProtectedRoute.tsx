/**
 * we dont need localstorage or redux for protected routes for Firebase Auth
 * because `auth.currentUser` and `onAuthStateChanged` provide the user state directly
 * firebase also securely handles session persistence and token management.
 */

import { auth } from "@/firebase/config"
import { Spinner } from "@nextui-org/react"
import { onAuthStateChanged, User } from "firebase/auth"
import { PropsWithChildren, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setIsLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoading(false);
        });

        return () => unsubscribe()
    }, [])

    if (loading) {
        return <Spinner label="Checking your credentials..." />
    }

    return user ? children : <Navigate to="/403" replace={true} />
}