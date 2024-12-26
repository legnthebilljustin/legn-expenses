import { getExpensesByDateRange } from "@/apis/expenses"
import { useEffect, useState } from "react"

type ExpensesMetricsType = {
    amount: number
    transactions: number
}

const initialState = {
    amount: 0,
    transactions: 0
}

export const useMetricsExpenses = (userUid: string | null) => {
    const [expensesMetrics, setExpensesMetrics] = useState<ExpensesMetricsType>(initialState)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (userUid) {
            getMonthToDateSummary(userUid)
        }
    }, [userUid])


    const getMonthToDateSummary = async(userUid: string) => {
        const today = new Date()
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

        const { data } = await getExpensesByDateRange(userUid, startOfMonth, endOfMonth)
        
        let totalAmount = 0
        let totalTransactions = 0

        data?.map((doc) => {
            const { price } = doc.data()

            if (typeof price === "number") {
                totalAmount += price
                totalTransactions += 1
            } else {
                // do something here to catch the invalid transactions
            }
            
        })

        setExpensesMetrics({
            amount: totalAmount,
            transactions: totalTransactions
        })
        setIsLoading(false)
    }

    return {
        expensesMetrics,
        isLoading
    }
}