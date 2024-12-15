import { Button, Spinner } from "@nextui-org/react"
import { useDispatch } from "react-redux"
import { useFetchExpenses } from "@/hooks"
import { openNotification, setNotificationMessage } from "@/state/notificationSlice"
import { ExpensesList } from "@/components"

export default function Dashboard() {
    const { 
        expenses, 
        isLoading,
        isLoadingAdditional,
        loadMoreData,
        errors
    } = useFetchExpenses()
    const dispatch = useDispatch()

    if (isLoading) {
        return <Spinner label="Getting your transactions..." color="primary" />
    }

    if (errors) {
        dispatch(setNotificationMessage(errors?.message || "Unable to fetch expenses."))
        dispatch(openNotification())

        return false
    }

    if (!expenses.length) {
        return <div className="text-center mt-8">No expenses found.</div>
    }

    return (
        <div className="max-w-[700px]">
            <ExpensesList groupedExpenses={expenses} />
            <div className="flex my-4 justify-center">
                <Button size="sm" color="primary" className="mr-2"
                    onClick={loadMoreData}
                    isLoading={isLoadingAdditional}
                >Next</Button>
            </div>
        </div>
    )
}