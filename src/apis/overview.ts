import { collection, doc, getDocs, increment, query, updateDoc, where } from "firebase/firestore/lite"
import { firestoreHandler } from "../firebase/firestoreService"
import collections from "../firebase/collections"
import db from "../firebase/config"

export type UpdateExpensesOverviewFields = {
    amount: number
    transactions: number
}

export const findAndUpdateExpensesOverview = async(updateData: UpdateExpensesOverviewFields) => {
    return firestoreHandler(async() => {
        const { data } = await findExpensesOverview("expenses")
        if (data?.empty) {
            throw new Error("No matching documents found.")
        }
        
        if (data?.docs) {
            await updateExpensesOverview(data.docs[0].id, updateData)
        }
    })
}

const findExpensesOverview = async(fieldName: string) => {
    return firestoreHandler(async() => {
        const expensesRef = collection(db, collections.OVERVIEW)
        const q = query(expensesRef, where("name", "==", fieldName))

        const querySnapshot = await getDocs(q)
        return querySnapshot
    })
}

const updateExpensesOverview = async(docId: string, updateData: UpdateExpensesOverviewFields) => {
    return firestoreHandler(async() => {
        const docRef = doc(db, collections.OVERVIEW, docId)

        await updateDoc(docRef, {
            amount: increment(updateData.amount),
            transactions: increment(updateData.transactions)
        })
    })
}