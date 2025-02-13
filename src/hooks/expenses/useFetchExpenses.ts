import { useCallback, useEffect, useState } from "react"
import { GroupedExpensesType } from "@/types/expenses"
import { EXPENSES_LIMIT, getAdditionalExpenses, getExpenses } from "@/apis/expenses"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/state/store"
import { QueryDocumentSnapshot } from "firebase/firestore/lite"
import { ExpenseSchema } from "@/schema"
import { openErrorModal } from "@/state/errorSlice"

export const useFetchExpenses = () => {
    const { uid } = useSelector((state: RootState) => state.auth)
    const [expensesList, setExpensesList] = useState<GroupedExpensesType[]>([])
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [iseFetchingAdditional, setIsFetchingAdditional] = useState(false)
    const [isAllExpensesFetched, setIsAllExpensesFetched] = useState(false)
    const [lastSnapshot, setLastSnapshot] = useState<QueryDocumentSnapshot | undefined>(undefined)
    const dispatch = useDispatch()

    useEffect(() => {
        if (uid) {
            const query = async() => {
                try {
                    const response = await getExpenses(uid)
                    
                    if (!response.length) {
                        return
                    }
                    // if one or more item is a schema mismatch,
                    // we still want to show the expenses but we should inform that a data is incorrect
                    const validation = validateDocumentSnapshot(response)
                    if (!validation) {
                        dispatch(openErrorModal({
                            message: "Some of your transactions have the incorrect format and are hidden from the list.",
                            code: 400
                        }))
                        
                    }

                    processExpensesSnapshots(response)
                } catch (error) {
                    dispatch(openErrorModal({
                        message: "Unable to fetch expenses.",
                        code: 400
                    }))
                    
                } finally {
                    setIsInitialLoading(false)
                }
            }

            query()
        }

    }, [uid])

    const validateDocumentSnapshot = (data: QueryDocumentSnapshot[]): boolean => {
        const isValidated = data.every((doc) => {
            const expenseData = { ...doc.data() }
            const result = ExpenseSchema.safeParse(expenseData)

            if (!result.success) {
                return false
            }

            return true
        })

        return isValidated
    }

    const processExpensesSnapshots = (data: QueryDocumentSnapshot[]) => {
        const groupedExpenses = groupExpensesByPurchaseDate(data)
        setExpensesList(groupedExpenses)
        setLastSnapshot(data[data.length - 1])
    }

    const loadNextPage = useCallback(async() => {
        if (!uid || lastSnapshot == undefined) {
            dispatch(openErrorModal({
                message: "Missing required information. Cannot fetch additional expenses.",
                code: 400
            }))
            return 
        }

        setIsAllExpensesFetched(false)
        setIsFetchingAdditional(true)

        try {
            const response = await getAdditionalExpenses(lastSnapshot, uid)

            if (response.length === 0) {
                setExpensesList([])
                setLastSnapshot(undefined)
                setIsAllExpensesFetched(true)
            } else {
                const grouped = groupExpensesByPurchaseDate(response)
                setExpensesList(grouped)
                setLastSnapshot(response[response.length - 1])
                setIsAllExpensesFetched(response.length < EXPENSES_LIMIT)
            }

        } catch (err: any) {
            dispatch(openErrorModal({
                message: err?.message || "An unknown error occured.",
                code: err?.code || 400
            }))
            
        } finally {
            setIsFetchingAdditional(false)
        }
    }, [lastSnapshot, uid])

    const groupExpensesByPurchaseDate = (docs: QueryDocumentSnapshot[]): GroupedExpensesType[] => {
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
        isAllExpensesFetched,
        loadNextPage
    }
}