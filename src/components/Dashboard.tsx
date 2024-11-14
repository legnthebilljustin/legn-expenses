import { useEffect, useState } from "react"
import { getAdditionalExpenses, getTExpenses } from "../apis/expenses"
import ExpensesItem from "./ExpensesItem";
import { Button, Spinner } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { openNotification, setNotificationMessage } from "../state/notificationSlice";
import { DocumentSnapshot } from "firebase/firestore/lite";
import { migrateMonthlyExpenses } from "../apis/overview";

export type ExpensesItemType = {
    id: string
    price: number
    itemName: string
    purchaseDate: string
}

export default function Dashboard() {
    const [transactions, setTransasctions] = useState<ExpensesItemType[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isFetchingAdditional, setIsFetchingAdditional] = useState(false)
    const [lastSnapshot, setLastSnapshot] = useState<DocumentSnapshot | undefined>(undefined)
    const dispatch = useDispatch()

    useEffect(() => {
        const query = async() => {
            const { data, success, error } = await getTExpenses()

            if (!success) {
                dispatch(setNotificationMessage(error || "Unable to fetch expenses."))
                dispatch(openNotification())

                return false
            }

            if (data?.docs.length === 0) {
                return setIsLoading(false)
            }

            const expenses = handleDataIteration(data?.docs)

            setTransasctions(expenses)
            setLastSnapshot(data?.docs[data.docs.length - 1])
            setIsLoading(false)
        }

        query()
    }, [])

    const loadMoreData = async() => {
        // needs to do something if no more additional transactions
        // continuous fetch will return `Function startAfter() called with invalid data. Unsupported field value: undefined`

        setIsFetchingAdditional(true)
        if (lastSnapshot === undefined) {
            return false
        }

        const { data, success, error } = await getAdditionalExpenses(lastSnapshot)

        if (!success) {
            dispatch(setNotificationMessage(error || "Unable to fetch additional expenses."))
            dispatch(openNotification())

            return false
        }
        
        const expenses = handleDataIteration(data?.docs)
        setTransasctions(prevTransactions => [
            ...prevTransactions,
            ...expenses
        ])

        setLastSnapshot(data?.docs[data.docs.length - 1])
        setIsFetchingAdditional(false)
    }

    const handleDataIteration = (data: any) => {
        const expenses: ExpensesItemType[] = []

        if (data && data.length > 0) {
            data.forEach((doc: any) => {
                const { purchaseDate, itemName, price } = doc.data()
                const parsedPurchaseDate = new Date(purchaseDate.seconds * 1000).toDateString()
    
                expenses.push({
                    id: doc.id,
                    purchaseDate: parsedPurchaseDate,
                    itemName, price
                })
            })
        }
        
        return expenses
    }

    if (isLoading) {
        return <Spinner label="Getting your transactions..." color="primary" />
    }

    return (
        <>
            <div className="max-w-[600px]">
                <Button color="primary" onClick={() => migrateMonthlyExpenses()}>Migrate October Expenses</Button>
                <div className="font-bold mb-3">TRANSACTIONS</div>
                {transactions?.map((item: any) => <ExpensesItem key={item.id} item={item as ExpensesItemType} />)}
                
                <div className="flex my-4 justify-center">
                    <Button size="sm" color="primary" className="mr-2"
                        onClick={() => loadMoreData()}
                        isLoading={isFetchingAdditional}
                    >Load more transactions...</Button>
                </div>
            </div>
        </>
    )

}