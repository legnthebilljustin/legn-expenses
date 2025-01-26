import { GroupedExpensesType } from "@/types/expenses"
import ExpensesTable from "./ExpensesTable"
import { useFetchExpenses } from "@/hooks"
import { useDispatch } from "react-redux"
import { Button, Spinner } from "@nextui-org/react"
import { openErrorModal, setErrorDetails } from "@/state/errorSlice"

export default function ExpensesList() {
    const {
        expenses,
        isLoading,
        isLoadingAdditional,
        errors,
        loadNextPage,
        isAllExpensesFetched
    } = useFetchExpenses()
    const dispatch = useDispatch()

    if (isLoading) {
        return <Spinner label="Getting your transactions..." color="primary" />
    }

    if (errors) {
        dispatch(setErrorDetails({
            message: errors?.message || "Unable to fetch list of expenses.",
            code: errors.code || 500
        }))
        dispatch(openErrorModal())
    }

    if (!expenses.length) {
        return <div className="text-center mt-8">No expenses found.</div>
    }

    return (
        <>
            <div className="max-w-[700px]">
                {expenses.map((group: GroupedExpensesType, index: number) => (
                    <div key={index}>
                        <div className="date text-xs font-bold mb-2 mt-4 uppercase text-gray-400">{ group.purchaseDate }</div>
                        <ExpensesTable expenses={group.expenses} />
                    </div>
                ))}

                <div className="flex my-4 justify-center">
                    <Button size="sm" color="primary"
                        onClick={loadNextPage}
                        isLoading={isLoadingAdditional}
                        isDisabled={isAllExpensesFetched}
                    >
                        Next Page&nbsp;<i className='bx bx-last-page'></i>
                    </Button>
                </div>
            </div>
        </>
    )
}