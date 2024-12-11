import { ChangeEvent, useCallback, useMemo, useState } from "react"
import { CalendarDate } from "@nextui-org/react"
import { useDispatch } from "react-redux"

import { openErrorModal, setErrorDetails } from "@/state/errorSlice"
import { openNotification, setNotificationMessage } from "@/state/notificationSlice"
import { findAndUpdateExpensesOverview } from "@/apis/overview"
import { addExpenses } from "@/apis/expenses"

import { UpdateExpensesOverviewFields } from "@/types/overviews"
import { ExpensesFormInputGroupType } from "@/types/expenses"

import { useErrorHandler } from "../useErrorHandler"
import { isACalendarDate } from "@/utils/dates"


type ReturnType = {
    formData: ExpensesFormInputGroupType[]
    purchaseDate: CalendarDate | null
    isSubmittingForm: boolean
    handleDateInputChange: (date: CalendarDate) => void
    handleInputChange: (event: ChangeEvent<HTMLInputElement>, index: number) => void
    addFormDataItem: () => void
    removeFormDataItem: (indexToRemove: number) => void
    handleExpensesFormSubmit: () => void
}

export const useAddExpenses = (): ReturnType => {
    const [purchaseDate, setPurchaseDate] = useState<CalendarDate | null>(null)
    const [formData, setFormData] = useState<ExpensesFormInputGroupType[]>([])
    const [isSubmittingForm, setIsSubmittingForm] = useState(false)
    const { setErrors, resetError } = useErrorHandler()

    const dispatch = useDispatch()

    const parsedPurchaseDate: Date | null = useMemo(() => {
        if (purchaseDate !== null) {
            const { year, month, day } = purchaseDate
            return new Date(year, month - 1, day)
        }
        return null
    }, [purchaseDate])

    const addFormDataItem = useCallback(async() => {
        const newExpensesItem: ExpensesFormInputGroupType = {
            price: 0,
            itemName: "",
            purchaseDate: parsedPurchaseDate,
            paymentMethod: "",
            cardId: ""
        }

        setFormData(prevFormData => [...prevFormData, newExpensesItem])
    }, [parsedPurchaseDate, setFormData])

    const removeFormDataItem = useCallback((indexToRemove: number) => {
        setFormData((prevFormData) => prevFormData.filter((_, index) => index !== indexToRemove))
    }, [setFormData])

    const handleDateInputChange = (date: CalendarDate): void => {
        if (!isACalendarDate(date)) {
            setErrors({
                message: "Purchase Date must be a valid CalendarDate",
                code: 400
            })

            return
        }

        setPurchaseDate(date)
    }

    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = event.target
        
        if (name === undefined || value === undefined) {
            throw new Error("Input element is missing a `name` or a `value` attribute.")
        }

        if (value === "") {
            throw new Error("Cannot have an empty value.")
        }

        const updatedFormData = [...formData]

        updatedFormData[index] = {
            ...updatedFormData[index],
            [name]: name === "price" ? parseFloat(value) : value
        }

        setFormData(updatedFormData)
    }, [formData, setFormData])

    const handleExpensesFormSubmit = useCallback(async() => {
        resetError()
        setIsSubmittingForm(true)
        console.log(formData)

        const { data, success, error, errorCode } = await addExpenses(formData)

        if (success && data?.data) {
            const overviewUpdateData = {
                amount: data.data.amount,
                transactions: data.data.transactions
            } as UpdateExpensesOverviewFields

            // gotta know how this will catch errors
            // also there should be a fallback or error logs in case below function fails for some reason
            await findAndUpdateExpensesOverview(overviewUpdateData)

            dispatch(setNotificationMessage("New expenses has been added."))
            dispatch(openNotification())

            setFormData([])
            setPurchaseDate(null)
            setIsSubmittingForm(false)
            return
        }

        dispatch(setErrorDetails({ 
            message: error || "Unknown error occurred. Unable to add expenses", 
            code: errorCode || 503 
        }))
        dispatch(openErrorModal())

        setIsSubmittingForm(false)
    }, [setIsSubmittingForm, setFormData, setPurchaseDate, resetError])

    return {
        purchaseDate,
        formData,
        isSubmittingForm,
        handleDateInputChange,
        handleInputChange,
        addFormDataItem,
        removeFormDataItem,
        handleExpensesFormSubmit,
    }
}