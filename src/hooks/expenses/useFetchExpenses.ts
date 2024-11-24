import { useCallback, useEffect, useState } from "react"
import { ExpensesItemType } from "../../types/expenses"
import { DocumentSnapshot } from "firebase/firestore/lite"
import { useErrorHandler } from "../useErrorHandler"
import { getAdditionalExpenses, getTExpenses } from "../../apis/expenses"

type ReturnType = {
    expenses: ExpensesItemType[]
    isLoading: boolean
    isLoadingAdditional: boolean
    errors: any
    loadMoreData: () => void
}

export const useFetchExpenses = (): ReturnType => {
    const [expensesList, setExpensesList] = useState<ExpensesItemType[]>([])
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [iseFetchingAdditional, setIsFetchingAdditional] = useState(false)
    const [lastSnapshot, setLastSnapshot] = useState<DocumentSnapshot | undefined>(undefined)
    
    const { errors, setErrors, resetError } = useErrorHandler()

    useEffect(() => {
        const query = async() => {
            const { data, success, error, errorCode } = await getTExpenses()
            checkIfSuccess(success, error, errorCode)

            const expenses = handleExpensesIteration(data)
            setExpensesList(expenses)
            setLastSnapshot(data?.docs[data.docs.length - 1])
            setIsInitialLoading(false)
        }

        query()
    }, [])

    const loadMoreData = useCallback(async() => {
        resetError()
        // needs to do something if no more additional transactions
        // continuous fetch will return `Function startAfter() called with invalid data. Unsupported field value: undefined`
        setIsFetchingAdditional(true)
        if (lastSnapshot === undefined) {
            return false    // what to do in this scenario?
        }

        const { data, success, error, errorCode } = await getAdditionalExpenses(lastSnapshot)

        checkIfSuccess(success, error, errorCode)

        const expenses = handleExpensesIteration(data?.docs)
        setExpensesList(prevExpensesList => [
            ...prevExpensesList,
            ...expenses
        ])

        setLastSnapshot(data?.docs[data.docs.length - 1])
        setIsFetchingAdditional(false)
    }, [expensesList, lastSnapshot, setExpensesList, resetError])

    const handleExpensesIteration = (expensesParam: any): ExpensesItemType[] => {
        const expenses: ExpensesItemType[] = []

        if (expensesParam) {
            expensesParam.forEach((doc: any) => {
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

    const checkIfSuccess = (didFail: boolean, message: string | undefined, code: number | undefined) => {
        if (!didFail) {
            setErrors({
                message: message || "An unknown error occured.",
                code: code || 400
            })

            return false
        }
    }

    return {
        expenses: expensesList,
        isLoading: isInitialLoading,
        isLoadingAdditional: iseFetchingAdditional,
        errors,
        loadMoreData
    }
}