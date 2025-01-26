/**
 * we dont need localstorage or redux for protected routes for Firebase Auth
 * because `auth.currentUser` and `onAuthStateChanged` provide the user state directly
 * firebase also securely handles session persistence and token management.
 */

import { RootState } from "@/state/store"
import { Spinner } from "@nextui-org/react"
import React, { PropsWithChildren } from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const ProtectedRoute = React.memo(({ children }: PropsWithChildren) => {
    const { uid } = useSelector((state: RootState) => state.auth);
  
    if (uid === null) {
      return <Spinner label="Checking your credentials..." />;
    }
  
    return uid ? <>{children}</> : <Navigate to="/403" replace />;
  });
  
  export default ProtectedRoute;