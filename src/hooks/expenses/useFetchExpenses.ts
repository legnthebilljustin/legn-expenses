import { useCallback, useEffect, useState } from "react"
import { DocumentSnapshot } from "firebase/firestore/lite"
import { GroupedExpensesType } from "@/types/expenses"
import { useErrorHandler } from "@/hooks/useErrorHandler"
import { getAdditionalExpenses, getExpenses } from "@/apis/expenses"
import { useSelector } from "react-redux"
import { RootState } from "@/state/store"

type ReturnType = {
    expenses: GroupedExpensesType[]
    isLoading: boolean
    isLoadingAdditional: boolean
    errors: any
    loadMoreData: () => void
}

export const useFetchExpenses = (): ReturnType => {
    const { uid } = useSelector((state: RootState) => state.auth)
    const [expensesList, setExpensesList] = useState<GroupedExpensesType[]>([])
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [iseFetchingAdditional, setIsFetchingAdditional] = useState(false)
    const [lastSnapshot, setLastSnapshot] = useState<DocumentSnapshot | undefined>(undefined)
    
    const { errors, setErrors, resetError } = useErrorHandler()

    useEffect(() => {
        const query = async() => {
            if (uid) {
                const { data, success, error, errorCode } = await getExpenses(uid)

                if (!data || !success) {
                    setErrors({
                        message: error || "An unknown error occured.",
                        code: errorCode || 400
                    })
        
                    return false
                }
                
                const groupedExpenses = groupExpensesByPurchaseDate(data)
                setExpensesList(groupedExpenses)
                setLastSnapshot(data[data.length - 1])
                setIsInitialLoading(false)
            }
        }
        query()
    }, [uid])

    const loadMoreData = useCallback(async() => {
        resetError()
        // needs to do something if no more additional transactions
        // continuous fetch will return `Function startAfter() called with invalid data. Unsupported field value: undefined`
        setIsFetchingAdditional(true)
        if (lastSnapshot === undefined || !uid) {
            return false    // what to do in this scenario?
        }

        const { data, success, error, errorCode } = await getAdditionalExpenses(lastSnapshot, uid)

        if (!data || !success) {
            setErrors({
                message: error || "An unknown error occured.",
                code: errorCode || 400
            })

            return false
        }
        
        const grouped = groupExpensesByPurchaseDate(data)
        /**
         * NOTE: commenting this out since i am still deciding if additional expenses should be appended or;
         * if i will do pagination instead
         */
        // setExpensesList(prevExpensesList => [
        //     ...prevExpensesList,
        //     ...grouped
        // ])
        
        setExpensesList(grouped)

        setLastSnapshot(data[data.length - 1])
        setIsFetchingAdditional(false)
    }, [expensesList, lastSnapshot, setExpensesList, resetError])

    const groupExpensesByPurchaseDate = (docs: any): GroupedExpensesType[] => {
        const grouped = docs.reduce((grouped: any, doc: any) => {
            const purchaseDate = doc.data().purchaseDate.toDate();
            const dateKey = purchaseDate.toDateString();

            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push({ id: doc.id, ...doc.data() });

            return grouped;
        }, {})

        const entries = Object.entries(grouped).map(([date, expenses]) => ({
            purchaseDate: date,
            expenses,
        }));

        return entries as GroupedExpensesType[]
    }

    return {
        expenses: expensesList,
        isLoading: isInitialLoading,
        isLoadingAdditional: iseFetchingAdditional,
        errors,
        loadMoreData
    }
}