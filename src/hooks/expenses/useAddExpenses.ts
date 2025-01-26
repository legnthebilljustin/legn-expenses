import { ChangeEvent, useCallback, useMemo, useState } from "react"
import { CalendarDate } from "@nextui-org/react"
import { useDispatch, useSelector } from "react-redux"

import { openErrorModal, setErrorDetails } from "@/state/errorSlice"
import { openNotification, setNotificationMessage } from "@/state/notificationSlice"
import { findAndUpdateExpensesOverview } from "@/apis/overview"
import { addExpenses } from "@/apis/expenses"

import { UpdateExpensesOverviewFields } from "@/types/overviews"
import { ExpensesFormInputGroupType } from "@/types/expenses"

import { useErrorHandler } from "../useErrorHandler"
import { isACalendarDate } from "@/utils/dates"
import { RootState } from "@/state/store"
import { CardsForDropdownType } from "@/types/cards"
import { validateSchemaDataArray } from "@/utils/service"
import { ExpenseSchema } from "@/schema"

type Props = {
    creditCardsList: CardsForDropdownType[]
}

export const useAddExpenses = ({ creditCardsList }: Props) => {
    const { uid } = useSelector((state: RootState) => state.auth)
    // see comment in `hooks/crypto/useCryptoAssetFormData.ts`
    const [purchaseDate, setPurchaseDate] = useState<CalendarDate | null>(null)
    const [formData, setFormData] = useState<ExpensesFormInputGroupType[]>([])
    const [isSubmittingForm, setIsSubmittingForm] = useState(false)
    // Reminder: this below may no longer be needed since we now have an error reducer
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
            paymentMethod: "",
            cardId: "",
            card: null,
            purchaseDate: parsedPurchaseDate
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

    const handleCardSelectionInputChange = useCallback((event: ChangeEvent<HTMLSelectElement>, index: number) => {
        const { name, value } = event.target
        
        checkEmptyNameAndValue(name, value)
        const card = searchCardById(value)

        const cardDetails = {
            name: card?.name, color: card?.color
        }

        const updatedFormData = [...formData]
        updatedFormData[index] = {
            ...updatedFormData[index],
            card: cardDetails,
            cardId: value
        }

        setFormData(updatedFormData)
    }, [formData, setFormData])

    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = event.target
        
        checkEmptyNameAndValue(name, value)

        const updatedFormData = [...formData]

        updatedFormData[index] = {
            ...updatedFormData[index],
            [name]: name === "price" ? parseFloat(value) : value
        }

        setFormData(updatedFormData)
    }, [formData, setFormData])

    const searchCardById = (value: string): CardsForDropdownType | undefined => {
        return creditCardsList.find(card => card.id === value)
    }   

    const checkEmptyNameAndValue = (name: any, value: any) => {
        if (name === undefined || value === undefined) {
            throw new Error("Input element is missing a `name` or a `value` attribute.")
        }

        if (value === "") {
            throw new Error("Cannot have an empty value.")
        }
    }

    const handleExpensesFormSubmit = useCallback(async() => {

        resetError()
        if (!formData.length || purchaseDate === null || uid === null) {
            dispatch(setErrorDetails({
                message: "Cannot process expenses form submission due to missing required information.",
                code: 400
            }))
            dispatch(openErrorModal())
            return 
        }

        const isSchemaValidated = validateSchemaDataArray(ExpenseSchema, formData)
        if (!isSchemaValidated) {
            dispatch(setErrorDetails({
                message: "Cannot process expenses form submission due to schema mismatch.",
                code: 400
            }))
            dispatch(openErrorModal())
            return
        }

        setIsSubmittingForm(true)
        
        const { data, success, error, errorCode } = await addExpenses(formData, uid)

        if (success && data?.data) {
            const overviewUpdateData = {
                amount: data.data.amount,
                transactions: data.data.transactions
            } as UpdateExpensesOverviewFields

            // gotta know how this will catch errors
            // also there should be a fallback or error logs in case below function fails for some reason
            await findAndUpdateExpensesOverview(uid, overviewUpdateData)

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
        handleCardSelectionInputChange
    }
}