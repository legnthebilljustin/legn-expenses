import { editExpensesItem } from "@/apis/expenses"
import { useExpenses } from "@/context/ExpensesContext"
import { openErrorModal } from "@/state/errorSlice"
import { openNotification, setNotificationMessage } from "@/state/notificationSlice"
import { RootState } from "@/state/store"
import { EditExpensesDetailsType, ExpensesItemType } from "@/types/expenses"
import { ChangeEvent, useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export const useEditExpenses = (expensesItem: EditExpensesDetailsType) => {
    const { uid } = useSelector((state: RootState) => state.auth)
    const { updateExpensesItem } = useExpenses()
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

        try {
            const doc = await editExpensesItem(uid || "", formData)
            
            if (doc.exists()) {
                const updatedData = { id: doc.id, ...doc.data() }
                updateExpensesItem(updatedData as ExpensesItemType)
            }
            dispatch(setNotificationMessage("Expenses item has been updated."))
            dispatch(openNotification())
            
        } catch (error: any) {
            dispatch(openErrorModal({
                message: error?.message || "Unable to update item. Something went wrong.",
                code: error?.code || 400
            }))
            
        } finally {
            setIsEditSubmitted(false)
        }
    }

    return {
        isEditSubmitted,
        handleInputChange,
        handleFormSubmit,
        formData
    }
}