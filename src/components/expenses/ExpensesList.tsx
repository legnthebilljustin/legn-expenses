import { EditExpensesDetailsType, GroupedExpensesType } from "@/types/expenses"
import ExpensesTable from "./ExpensesTable"
import { useFetchExpenses } from "@/hooks"
import { useDispatch } from "react-redux"
import { Button, Spinner } from "@nextui-org/react"
import { openErrorModal, setErrorDetails } from "@/state/errorSlice"
import EditExpensesForm from "./EditExpensesForm"
import { useCallback, useState } from "react"

export default function ExpensesList() {
    const {
        expenses,
        isLoading,
        isLoadingAdditional,
        errors,
        loadNextPage,
        isAllExpensesFetched
    } = useFetchExpenses()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editExpensesItemData, setEditExpensesItemData] = useState<EditExpensesDetailsType | null>(null)

    const dispatch = useDispatch()

    const onEditExpenseItem = useCallback((data: EditExpensesDetailsType) => {
        if (data.id && data.itemName && data.price) {
            setEditExpensesItemData(data)
            setIsEditModalOpen(true)
        }
        
    }, [dispatch])

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
            <div className="max-w-[800px]">
                {expenses.map((group: GroupedExpensesType, index: number) => (
                    <div key={index}>
                        <div className="date text-xs font-bold mb-2 mt-4 uppercase text-gray-400">{ group.purchaseDate }</div>
                        <ExpensesTable expenses={group.expenses} 
                            onEditExpenseItem={onEditExpenseItem}
                        />
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

            { isEditModalOpen && editExpensesItemData && 
                <EditExpensesForm 
                    isOpen={isEditModalOpen}
                    expensesItem={editExpensesItemData}
                    onModalClose={() => setIsEditModalOpen(false)}
                />
            }
        </>
    )
}