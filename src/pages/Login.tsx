import { auth } from "@/firebase/config";
import { openErrorModal, setErrorDetails } from "@/state/errorSlice";
import { Button, Input } from "@nextui-org/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogin = async() => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate('/dashboard', { replace: true })
        } catch(error) {
            dispatch(setErrorDetails({ message: "Invalid credentials.", code: 401 }))
            dispatch(openErrorModal())
        }
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center dark">
            <div className="w-full h-full max-w-[400px] max-h-[600px] text-center">
                <p className="mb-6 text-lg">Sign In</p>
                <Input size="sm" isRequired
                    name="email" label="Email" className="mb-2"
                    endContent={<i className='bx bxl-mailchimp bx-sm'></i>}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input size="sm" isRequired type="password"
                    name="password" label="Password" className="mb-2"
                    endContent={<i className='bx bxs-lock-alt bx-sm' ></i>}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button size="md" variant="flat"
                    className="w-full mt-3"
                    onClick={handleLogin}
                >Sign in to your Account</Button>
                <p className="mt-4 text-sm text-blue-300 cursor-pointer">Forgot your password?</p>
            </div>
        </div>
    )
}