import { useNavigate } from "react-router-dom"

export default function Unauthenticated() {
    const navigate = useNavigate()

    const goToLogin = () => {
        navigate('/login', { replace: true })
    }
    return (
        <div className="pt-32 flex flex-col items-center justify-center dark">
            <i className='bx bxs-invader bx-lg'></i>
            <p className="mt-2 text-red-400">Log In Required</p>
            <div className="text-sm mt-8">You are not allowed to be here. Invaders will be shot on sight.</div>
            <div className="text-sm">
                Get back into the
                <span className="text-blue-400 cursor-pointer" onClick={goToLogin}>&nbsp;login&nbsp;</span> 
                page before we see you.
            </div>
        </div>
    )
}