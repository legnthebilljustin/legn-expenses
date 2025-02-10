import { EditExpensesDetailsType, GroupedExpensesType } from "@/types/expenses"
import ExpensesTable from "./ExpensesTable"
import { useDeleteExpense } from "@/hooks"
import { useDispatch, useSelector } from "react-redux"
import { Button, Spinner } from "@nextui-org/react"
import EditExpensesForm from "./EditExpensesForm"
import { useCallback, useEffect, useState } from "react"
import { CONFIRMATION_TYPES, openConfirmationModal } from "@/state/confirmationSlice"
import { RootState } from "@/state/store"
import { ExpensesProvider, useExpenses } from "@/context/ExpensesContext"

const ExpensesList = () => {
    return (
        <ExpensesProvider>
            <ExpensesListChild />
        </ExpensesProvider>
    )
}

const ExpensesListChild = () => {
    const { actionConfirmed } = useSelector((state: RootState) => state.confirmation)
    const { groupedExpensesList, 
        isLoading, isLoadingAdditional, isAllExpensesFetched,
        loadNextPage

    } = useExpenses()
    const { isDeleting, deleteExpenseItem } = useDeleteExpense()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editExpensesItemData, setEditExpensesItemData] = useState<EditExpensesDetailsType | null>(null)
    const [expenseUidToDelete, setExpenseUidToDelete] = useState<string>("")

    const dispatch = useDispatch()

    const onEditExpenseItem = useCallback((data: EditExpensesDetailsType) => {
        if (data.id && data.itemName && data.price) {
            setEditExpensesItemData(data)
            setIsEditModalOpen(true)
        }
    }, [dispatch])

    const onDeleteItem = useCallback((expenseUid: string) => {
        setExpenseUidToDelete(expenseUid)
        dispatch(openConfirmationModal({
            message: "Are you sure you want to delete this item?",
            type: CONFIRMATION_TYPES.DELETE
        }))
    }, [dispatch])

    useEffect(() => {
        if (actionConfirmed) {
            deleteExpenseItem(expenseUidToDelete)
        }
    }, [actionConfirmed])

    if (isLoading) {
        return <Spinner label="Getting your transactions..." color="primary" />
    }

    if (!groupedExpensesList.length) {
        return <div className="text-center mt-8">No expenses found.</div>
    }

    if (isDeleting) {
        return <Spinner label="Processing your delete request..." color="warning" />
    }

    return (
        <>
            <div className="max-w-[800px]">
                {groupedExpensesList.map((group: GroupedExpensesType, index: number) => (
                    <div key={index}>
                        <div className="date text-xs font-bold mb-2 mt-4 uppercase text-gray-400">{ group.purchaseDate }</div>
                        <ExpensesTable expenses={group.expenses} 
                            onEditExpenseItem={onEditExpenseItem}
                            onDeleteItem={onDeleteItem}
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
export default ExpensesList