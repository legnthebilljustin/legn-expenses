import { collection, doc, DocumentSnapshot, getDocs, limit, orderBy, query, startAfter, writeBatch } from "firebase/firestore/lite"
import db from "../firebase/config"
import { ExpensesInputGroupType } from "../components/AddExpenses"
import { firestoreHandler, FirestoreResponse } from "../firebase/firestoreService"
import collections from "../firebase/collections"
import { UpdateExpensesOverviewFields } from "./overview"

const EXPENSES_LIMIT = 15

export const addExpenses = async(formData: ExpensesInputGroupType[]): Promise<FirestoreResponse<{
    data: UpdateExpensesOverviewFields
    message: string
    success: boolean
}>> => {
    return firestoreHandler(async() => {
        const batch = writeBatch(db)
        const collectionRef = collection(db, collections.EXPENSES)

        let totalAmount = 0

        formData.forEach(item => {
            const docRef = doc(collectionRef)
            totalAmount += item.price
            batch.set(docRef, item)    
        });

        try {
            await batch.commit()

            return {
                data: {
                    amount: totalAmount,
                    transactions: formData.length
                } as UpdateExpensesOverviewFields,
                message: "Transactions saved.",
                success: true
            }
        } catch (error) {
            throw new Error("Failed to save transactions.")
        }
    })
}

export const getTExpenses = async() => {
    return firestoreHandler(async() => {
        const querySnapshot = await getDocs(
            query(
                collection(db, collections.EXPENSES),
                orderBy("purchaseDate", "desc"),
                limit(EXPENSES_LIMIT)
            )
        )

        return querySnapshot
    })
}

export const getAdditionalExpenses = async(
    snapshot: DocumentSnapshot
) => {
    return firestoreHandler(async() => {
        const querySnapshot = await getDocs(
            query(
                collection(db, collections.EXPENSES),
                orderBy("purchaseDate", "desc"),
                startAfter(snapshot),
                limit(EXPENSES_LIMIT)
            )
        )

        return querySnapshot
    })
}