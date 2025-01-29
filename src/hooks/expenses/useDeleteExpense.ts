
import { deleteExpensesItem } from "@/apis/expenses"
import { openNotification, setNotificationMessage } from "@/state/notificationSlice"
import { RootState } from "@/state/store"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export const useDeleteExpense = () => {
    const { uid } = useSelector((state: RootState) => state.auth)
    const [isDeleting, setIsDeleting] = useState(false)
    const dispatch = useDispatch()

    const deleteExpenseItem = async(expenseUid: string) => {
        setIsDeleting(true)

        if (uid) {
            await deleteExpensesItem(uid, expenseUid)
            dispatch(setNotificationMessage("Expense item has been deleted."))
            dispatch(openNotification())
            setIsDeleting(false)

            setTimeout(() => window.location.reload(), 1500)
        }
    }

    return {
        isDeleting,
        deleteExpenseItem
    }
}