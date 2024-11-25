import { Dispatch, SetStateAction, useState } from "react"
import { ErrorPayloadType } from "@/state/errorSlice"

type ReturnType = {
    errors: ErrorPayloadType | null
    setErrors: Dispatch<SetStateAction<ErrorPayloadType | null>>
    resetError: () => void
}

export const useErrorHandler = (): ReturnType  => {
    const [errors, setErrors] = useState<ErrorPayloadType | null>(null)

    const resetError = () => setErrors(null)

    return {
        errors,
        setErrors,
        resetError
    }
}