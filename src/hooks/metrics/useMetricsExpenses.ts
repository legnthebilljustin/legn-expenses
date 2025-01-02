import { getExpensesByDateRange } from "@/apis/expenses"
import { getAllExpensesOverviewApi } from "@/apis/overview"
import { useEffect, useState } from "react"

type ExpensesMetricsType = {
    amount: number
    transactions: number
}
type ReturnType = {
    currentMonthExpensesMetrics: ExpensesMetricsType
    totalExpensesMetrics: ExpensesMetricsType
    isLoading: boolean
}

const initialState = {
    amount: 0,
    transactions: 0
}

export const useMetricsExpenses = (userUid: string | null): ReturnType => {
    const [currentMonthExpensesMetrics, setCurrentMonthExpensesMetrics] = useState<ExpensesMetricsType>(initialState)
    const [totalExpensesMetrics, setTotalExpensesMetrics] = useState<ExpensesMetricsType>(initialState)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (userUid) {
            loadInitialData(userUid)
        }
        async function loadInitialData(userUid: string) {
            await getMonthToDateSummary(userUid)
            await getAllExpensesOverview(userUid)

            setIsLoading(false)
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

        setCurrentMonthExpensesMetrics({
            amount: totalAmount,
            transactions: totalTransactions
        })
    }

    const getAllExpensesOverview = async(userUid: string) => {
        const { data } = await getAllExpensesOverviewApi(userUid);

        let totalAmount = 0
        let totalTransactions = 0
        
        if (data) {
            data?.map((doc) => {
                const { amount, transactions } = doc.data()

                if (typeof amount === "number" && typeof transactions === "number") {
                    totalAmount += amount
                    totalTransactions += transactions
                }
                // else here for invalid overview key types
            })
        }

        setTotalExpensesMetrics({
            amount: totalAmount,
            transactions: totalTransactions
        })
    }

    return {
        currentMonthExpensesMetrics,
        totalExpensesMetrics,
        isLoading
    }
}