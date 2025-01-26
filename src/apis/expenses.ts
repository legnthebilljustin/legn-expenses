import { collection, doc, QueryDocumentSnapshot, getDocs, limit, orderBy, query, startAfter, where, writeBatch } from "firebase/firestore/lite"
import db from "../firebase/config"
import { firestoreHandler, FirestoreResponse } from "../firebase/firestoreService"
import { UpdateExpensesOverviewFields } from "@/types/overviews"
import { ExpensesFormInputGroupType } from "@/types/expenses"
import { COLLECTIONS } from "@/firebase/collections"
import { getUserSubCollectionPath } from "@/utils/service"
import { COLLECTION_KEYS } from "@/constants/keys"

export const EXPENSES_LIMIT = 50
const BASE_PATH = `${COLLECTIONS.USERS}/`

export const addExpenses = async(
    formData: ExpensesFormInputGroupType[],
    userUid: string
): Promise<FirestoreResponse<{
    data: UpdateExpensesOverviewFields
    message: string
    success: boolean
}>> => {

    return firestoreHandler(async() => {
        const userCollectionPath = getUserSubCollectionPath(userUid, `${COLLECTIONS.EXPENSES}`)
        const batch = writeBatch(db)
        const collectionRef = collection(db, userCollectionPath)

        let totalAmount = 0

        formData.forEach((item: ExpensesFormInputGroupType) => {
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

export const getExpenses = async(userUid: string) => {
    
    return firestoreHandler(async() => {
        const querySnapshot = await getDocs(
            query(
                collection(db, `${BASE_PATH + userUid}/${COLLECTIONS.EXPENSES}`),
                orderBy("purchaseDate", "desc"),
                limit(EXPENSES_LIMIT)
            )
        )
        return querySnapshot.docs
    })
}

export const getAdditionalExpenses = async(
    snapshot: QueryDocumentSnapshot,
    userUid: string
) => {
    return firestoreHandler(async() => {
        const querySnapshot = await getDocs(
            query(
                collection(db, `${BASE_PATH + userUid}/${COLLECTIONS.EXPENSES}`),
                orderBy("purchaseDate", "desc"),
                startAfter(snapshot),
                limit(EXPENSES_LIMIT)
            )
        )

        return querySnapshot.docs
    })
}

export const getExpensesByDateRange = async(userUid: string, startDate: any, endDate: any) => {
    return firestoreHandler(async() => {
        const querySnapshot = await getDocs(
            query(
                collection(db, `${BASE_PATH + userUid}/${COLLECTIONS.EXPENSES}`),
                orderBy(COLLECTION_KEYS.PURCHASE_DATE, "desc"),
                where(COLLECTION_KEYS.PURCHASE_DATE, ">=", startDate),
                where(COLLECTION_KEYS.PURCHASE_DATE, "<=", endDate)
            )
        )

        return querySnapshot.docs
    })
}