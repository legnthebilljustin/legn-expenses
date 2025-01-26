import db, { auth } from "@/firebase/config";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { setUid } from "@/state/authSlice";
import { Button, Input } from "@nextui-org/react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore/lite";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


export default function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    useAuthRedirect()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleRegistration = async() => {
        try {
            // firebase auth registration
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)

            // save new user details to users collection
            const user = userCredential.user
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email,
                createdAt: new Date().toISOString()
            })
            dispatch(setUid(user.uid))
            navigate('/dashboard', { replace : true })
        } catch(error) {
            console.log(error)
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center dark">
            <div className="w-full h-full max-w-[400px] max-h-[600px] text-center">
                <p className="mb-6 text-lg">Register for an Account</p>
                <Input size="sm" isRequired
                    name="name" label="Name" className="mb-2"
                    endContent={<i className='bx bxl-mailchimp bx-sm'></i>}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
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
                    onClick={handleRegistration}
                >Register</Button>
                <p className="mt-4 text-sm text-blue-300 cursor-pointer">Forgot your password?</p>
            </div>
        </div>
    )
}