import { Button, Spinner } from "@nextui-org/react"
import { useDispatch } from "react-redux"
import ExpensesItem from "@/components/expenses/ExpensesItem"
import { useFetchExpenses } from "@/hooks"
import { openNotification, setNotificationMessage } from "@/state/notificationSlice"

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

    return (
        <div className="max-w-[600px]">
            {/* <Button color="primary" onClick={() => migrateMonthlyExpenses()}>Migrate October Expenses</Button> */}
            {/* everything below here should be transferred to the "Expenses" page */}
            <div className="font-bold mb-3">TRANSACTIONS</div>
            
            {expenses.map((item: any) => <ExpensesItem key={item.id} item={item} />)}

            <div className="flex my-4 justify-center">
                <Button size="sm" color="primary" className="mr-2"
                    onClick={loadMoreData}
                    isLoading={isLoadingAdditional}
                >Load more expenses...</Button>
            </div>
        </div>
    )
}