import { CardFormInputType } from "@/types/cards"
import { ChangeEvent, useCallback, useState } from "react"
import { useErrorHandler } from "../useErrorHandler"

import { addCard } from "@/apis/cards"
import { useDispatch } from "react-redux"
import { openNotification, setNotificationMessage } from "@/state/notificationSlice"
import { openErrorModal } from "@/state/errorSlice"
import { validateSchemaObject } from "@/utils/service"
import { CreditCardSchema } from "@/schema"
import { FirestoreCreditCard } from "@/schema/creditCardSchema"

type ReturnType = {
    formData: CardFormInputType
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void
    isFormSubmitted: boolean
    handleAddCardFormSubmit: (userUid: string) => void
}

export const useAddCards = (): ReturnType => {
    const [formData, setFormData] = useState<CardFormInputType>({
        name: "",
        billingDay: 0,
        dueDaysAfterBilling: 0,
        color: ""
    })
    const [isFormSubmitted, setIsFormSubmitted] = useState(false)
    const { resetError } = useErrorHandler()
    const dispatch = useDispatch()

    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target

        if (name === undefined || value === undefined) {
            throw new Error("Input element is missing a `name` or a `value` attribute." )
        }

        if (value.trim() === "") {
            throw new Error("Cannot have an empty value.")
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: ["billingDay", "dueDaysAfterBilling"].includes(name) ? Number(value) : value
        }))
    }, [setFormData])

    const handleAddCardFormSubmit = useCallback(async(userUid: string) => {
        resetError()
        setIsFormSubmitted(true)

        try {
            const parsedData: FirestoreCreditCard = validateSchemaObject(CreditCardSchema, formData)
            await addCard(parsedData, userUid)
            dispatch(setNotificationMessage(`New card ${formData.name} has been added.`))
            dispatch(openNotification())

            // just reset
            setFormData({
                name: "",
                billingDay: 0,
                dueDaysAfterBilling: 0,
                color: ""
            })
        } catch (error: any) {
            dispatch(openErrorModal({
                message: error.message || "Cannot add new card at this time.",
                code: 500
            }))
            
        } finally {
            setIsFormSubmitted(false)
        }
    }, [setFormData, resetError, setIsFormSubmitted]) 

    return {
        formData,
        handleInputChange,
        handleAddCardFormSubmit,
        isFormSubmitted
    }
}