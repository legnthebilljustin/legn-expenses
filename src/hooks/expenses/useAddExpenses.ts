import { ChangeEvent, useCallback, useMemo, useState } from "react"
import { CalendarDate } from "@nextui-org/react"
import { useDispatch, useSelector } from "react-redux"

import { openErrorModal, setErrorDetails } from "@/state/errorSlice"
import { openNotification, setNotificationMessage } from "@/state/notificationSlice"
import { createOverview, getOverviewDocument, updateOverview } from "@/apis/overview"
import { addExpensesAPI } from "@/apis/expenses"
import { ExpensesFormInputGroupType, ExpensesMetrics } from "@/types/expenses"
import { useErrorHandler } from "../useErrorHandler"
import { isACalendarDate } from "@/utils/dates"
import { RootState } from "@/state/store"
import { CardsForDropdownType } from "@/types/cards"
import { validateSchemaArray, validateSchemaObject } from "@/utils/service"
import { ExpenseSchema, OverviewSchema } from "@/schema"
import { FirestoreOverview } from "@/schema/overviewSchema"

type Props = {
    creditCardsList: CardsForDropdownType[]
}

export const useAddExpenses = ({ creditCardsList }: Props) => {
    const { uid } = useSelector((state: RootState) => state.auth)
    /**
     * see comment in `hooks/crypto/useCryptoAssetFormData.ts` 
     * explaining CalendarDate vs parsedPurchaseDate's Date
     * also in this hook, `purchaseDate` is used to provide the month and year for getting the overview document to update
     */
    const [purchaseDate, setPurchaseDate] = useState<CalendarDate | null>(null)
    const [formData, setFormData] = useState<ExpensesFormInputGroupType[]>([])
    const [isSubmittingForm, setIsSubmittingForm] = useState(false)
    // TODO: this below may no longer be needed since we now have an error reducer
    const { setErrors } = useErrorHandler()

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

    const handleExpensesFormSubmit = async() => {

        setIsSubmittingForm(true)
        try {
            if (!formData.length || purchaseDate === null || uid === null) {
                throw new Error("Please fill out all required fields.")
            }

            validateSchemaArray(ExpenseSchema, formData)

            const expensesTotals: ExpensesMetrics = await addExpensesAPI(uid, formData)

            const overview = await getOverviewDocument(uid, purchaseDate.year, purchaseDate.month)

            if (overview !== null) {
                await updateOverview(uid, overview.id, expensesTotals)
            } else {
                const data = {
                    month: purchaseDate.month,
                    year: purchaseDate.year,
                    ...expensesTotals
                }

                const validatedData: FirestoreOverview = validateSchemaObject(OverviewSchema, data)
                await createOverview(uid, validatedData)
            }

            dispatch(setNotificationMessage("New expenses added."))
            dispatch(openNotification())

            setFormData([])
            setPurchaseDate(null)
        } catch (error: any) {
            dispatch(setErrorDetails({
                message: error.message || "Something went wrong. Cannot add new expenses.",
                code: 400
            }))
            dispatch(openErrorModal())
        } finally {
            setIsSubmittingForm(false)
        }
    }

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