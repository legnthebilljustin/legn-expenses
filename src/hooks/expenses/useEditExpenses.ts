import { editExpensesItem } from "@/apis/expenses"
import { openErrorModal, setErrorDetails } from "@/state/errorSlice"
import { openNotification, setNotificationMessage } from "@/state/notificationSlice"
import { RootState } from "@/state/store"
import { EditExpensesDetailsType } from "@/types/expenses"
import { ChangeEvent, useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export const useEditExpenses = (expensesItem: EditExpensesDetailsType) => {
    const { uid } = useSelector((state: RootState) => state.auth)
    const [isEditSubmitted, setIsEditSubmitted] = useState(false)
    const [formData, setFormData] = useState<EditExpensesDetailsType>(expensesItem)

    const dispatch = useDispatch()

    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target

        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "price" && value ? parseFloat(value) : value,
        }));

    }, [dispatch])

    const handleFormSubmit = async() => {
        setIsEditSubmitted(true)

        const { success, error, errorCode } = await editExpensesItem(uid || "", formData)

        if (success) {
            dispatch(setNotificationMessage("Expenses item has been updated."))
            dispatch(openNotification())

            setTimeout(() => window.location.reload(), 2000)
        } else {
            dispatch(setErrorDetails({
                message: error || "Unable to update item. Something went wrong.",
                code: errorCode || 400
            }))
            dispatch(openErrorModal())
        }

        setIsEditSubmitted(false)
    }

    return {
        isEditSubmitted,
        handleInputChange,
        handleFormSubmit,
        formData
    }
}