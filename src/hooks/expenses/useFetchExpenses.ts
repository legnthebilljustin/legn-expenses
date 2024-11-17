import { useEffect, useState } from "react"
import { ExpensesItemType } from "../../types/expenses"
import { DocumentSnapshot } from "firebase/firestore/lite"

export const useFetchExpenses = () => {
    const [expenses, setExpenses] = useState<ExpensesItemType[]>([])
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [iseFetchingAdditional, setIsFetchingAdditional] = useState(false)
    const [lastSnapshot, setLastSnapshot] = useState<DocumentSnapshot | undefined>(undefined)
    const [errors, setErrors] = useState(null)

    useEffect(() => {
        const query = async() => {

        }
    }, [])
}