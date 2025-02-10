import { useCallback, useEffect, useState } from "react"
import { GroupedExpensesType } from "@/types/expenses"
import { useErrorHandler } from "@/hooks/useErrorHandler"
import { EXPENSES_LIMIT, getAdditionalExpenses, getExpenses } from "@/apis/expenses"
import { useSelector } from "react-redux"
import { RootState } from "@/state/store"
import { FirestoreResponse } from "@/firebase/firestoreService"
import { QueryDocumentSnapshot } from "firebase/firestore/lite"

export const useFetchExpenses = () => {
    const { uid } = useSelector((state: RootState) => state.auth)
    const [expensesList, setExpensesList] = useState<GroupedExpensesType[]>([])
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [iseFetchingAdditional, setIsFetchingAdditional] = useState(false)
    const [isAllExpensesFetched, setIsAllExpensesFetched] = useState(false)
    const [lastSnapshot, setLastSnapshot] = useState<QueryDocumentSnapshot | undefined>(undefined)
    
    const { errors, setErrors, resetError } = useErrorHandler()

    useEffect(() => {
        const query = async() => {
            if (uid) {
                const firestoreResponse = await getExpenses(uid)
                return processExpensesSnapshots(firestoreResponse)
            }
        }
        query()
    }, [uid])

    const processExpensesSnapshots = (firestoreData: FirestoreResponse) => {
        const { data, success, error, errorCode } = firestoreData

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

    const loadNextPage = useCallback(async() => {
        if (!uid || lastSnapshot === undefined) {
            return setErrors({
                message: "Missing required information. Cannot fetch additional expenses.",
                code: 400
            })
        }

        resetError()
        setIsAllExpensesFetched(false)
        setIsFetchingAdditional(true)

        try {
            const { data, success, error, errorCode } = await getAdditionalExpenses(lastSnapshot, uid)
            
            if (!data || !success) {
                throw { message: error, code: errorCode }
            }

            if (data.length === 0) {
                setExpensesList([])
                setLastSnapshot(undefined)
                setIsAllExpensesFetched(true)
            } else {
                const grouped = groupExpensesByPurchaseDate(data)
                setExpensesList(grouped)
                setLastSnapshot(data[data.length - 1])
                setIsAllExpensesFetched(data.length < EXPENSES_LIMIT)
            }

        } catch (err: any) {
            setErrors({
                message: err?.message || "An unknown error occured.",
                code: err?.code || 400
            })
        } finally {
            setIsFetchingAdditional(false)
        }
    }, [lastSnapshot, uid])

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
        isAllExpensesFetched,
        loadNextPage
    }
}