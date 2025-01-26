import { getExpensesByDateRange } from "@/apis/expenses"
import { getAllExpensesOverviewApi } from "@/apis/overview"
import { RootState } from "@/state/store"
import { ExpensesMetricsType, MonthlyExpensesListType } from "@/types/overviews"
import { formatMonthYear } from "@/utils/dates"
import { isANumber } from "@/utils/misc"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const expensesMetricsInitialState: ExpensesMetricsType = {
    amount: 0,
    transactions: 0
}

type ReturnType = {
    isLoading: boolean
    monthToDateExpenses: ExpensesMetricsType
    monthlyExpensesList: MonthlyExpensesListType[]
    overAllExpensesData: ExpensesMetricsType
}

export const useGetExpensesMetrics = (): ReturnType => {
    const { uid } = useSelector((state: RootState) => state.auth)
    const [isLoading, setIsLoading] = useState(true)
    const [monthToDateExpenses, setMonthToDateExpenses] = useState<ExpensesMetricsType>(expensesMetricsInitialState)
    const [monthlyExpensesList, setMonthlyExpensesList] = useState<MonthlyExpensesListType[]>([])
    const [overAllExpensesData, setOverAllExpensesData] = useState<ExpensesMetricsType>(expensesMetricsInitialState)
    
    useEffect(() => {
        if (uid) {
            loadInitialData(uid)
        }

        async function loadInitialData(uid: string) {
            await getMonthlyRecord(uid)
            await getMonthToDateSummary(uid)

            setIsLoading(false)
        }
    }, [uid])

    const getMonthToDateSummary = async(userUid: string) => {
        const today = new Date()

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

        const { data } = await getExpensesByDateRange(userUid, startOfMonth, endOfMonth)

        let totalAmount = 0
        let totalTransactions = 0

        data?.map((doc) => {
            const { price } = doc.data()

            if (isANumber(price)) {
                totalAmount += price
                totalTransactions += 1
            } else {
                // logger here for invalid data
            }
        })

        setMonthToDateExpenses({
            amount: totalAmount,
            transactions: totalTransactions
        })
    }
    
    const getMonthlyRecord = async(userUid: string) => {
        const { data } = await getAllExpensesOverviewApi(userUid)

        let totalAmount = 0
        let totalTransactions = 0
        const list: MonthlyExpensesListType[] = []

        if (data) {

            data?.map((doc) => {
                const { amount, transactions, year, month } = doc.data()

                if (isANumber(amount) && isANumber(transactions) && isANumber(year) && isANumber(month)) {
                    totalAmount += amount
                    totalTransactions += transactions

                    const date = formatMonthYear(month, year)

                    list.push({
                        amount, transactions, date
                    })
                }

                // else here for invalid overview data logger
            })
        }

        setMonthlyExpensesList(list)

        setOverAllExpensesData({
            amount: totalAmount,
            transactions: totalTransactions
        })
    }

    return {
        isLoading,
        monthToDateExpenses,
        overAllExpensesData,
        monthlyExpensesList
    }
}