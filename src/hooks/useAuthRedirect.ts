
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const useAuthRedirect = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const uid = localStorage.getItem("uid")
        
        if (uid) {
            navigate("/dashboard", { replace: true })
        } else {
            navigate('/403', { replace: true })
        }
    }, [])
}