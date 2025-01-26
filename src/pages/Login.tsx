import { auth } from "@/firebase/config";
import { setUid } from "@/state/authSlice";
import { Button, Input } from "@nextui-org/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isFormSubmitted, setIsFormSubmitted] = useState(false)
    const [error, setError] = useState<null | string>(null)

    useAuthRedirect()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogin = async() => {
        setError(null)
        setIsFormSubmitted(true)
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            dispatch(setUid(user.uid))
            navigate('/dashboard', { replace: true })
        } catch(error) {
            // not dispatching error reducer here since this component lives outside of the App component tree
            setError("Invalid credentials.")
        } finally {
            setIsFormSubmitted(false)
        }
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center dark">
            <div className="w-full h-full max-w-[400px] max-h-[600px] text-center">
                <p className="mb-6 text-lg">Sign In</p>
                { (!isFormSubmitted && error) &&
                    <div className="error-alert">
                        Invalid credentials!
                    </div>
                }
                    
                <Input size="sm" isRequired
                    name="email" label="Email" className="mb-2"
                    endContent={<i className='bx bxl-mailchimp bx-sm'></i>}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isDisabled={isFormSubmitted}
                />
                <Input size="sm" isRequired type="password"
                    name="password" label="Password" className="mb-2"
                    endContent={<i className='bx bxs-lock-alt bx-sm' ></i>}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isDisabled={isFormSubmitted}
                />
                
                <Button size="md" variant="flat"
                    className="w-full mt-3"
                    onClick={handleLogin}
                    isDisabled={isFormSubmitted}
                >
                    { !isFormSubmitted ? "Sign in to your Account" :
                        <>
                            Logging you in. Please wait <i className='bx bx-loader-circle bx-spin' />
                        </>
                    }
                </Button>
                <p className="mt-4 text-sm text-blue-300 cursor-pointer">Forgot your password?</p>
            </div>
        </div>
    )
}