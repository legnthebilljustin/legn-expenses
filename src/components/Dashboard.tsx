import { useEffect, useState } from "react"
import { getTExpenses } from "../apis/expenses"
import ExpensesItem from "./ExpensesItem";
import { Spinner } from "@nextui-org/react";

export type ExpensesItemType = {
    id: string
    price: number
    itemName: string
    purchaseDate: string
}

export default function Dashboard() {
    const [transactions, setTransasctions] = useState<ExpensesItemType[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const query = async() => {
            const snapshot = await getTExpenses()
            

            const expenses: ExpensesItemType[] = []
            snapshot?.docs.forEach(doc => {
                const { purchaseDate, itemName, price} = doc.data()
                const parsedPurchaseDate = new Date(purchaseDate.seconds * 1000).toDateString()

                expenses.push({
                    id: doc.id,
                    purchaseDate: parsedPurchaseDate,
                    itemName, price
                })
            })

            setTransasctions(expenses)
            setIsLoading(false)
            console.log(expenses)
        }

        query()
    }, [])

    if (isLoading) {
        return <Spinner label="Getting your transactions..." color="primary" />
    }

    return (
        <>
            <div className="max-w-[600px]">
                <div className="font-bold mb-3">TRANSACTIONS</div>
                {transactions?.map((item: any) => <ExpensesItem key={item.id} item={item as ExpensesItemType} />)}
            </div>
        </>
    )

}