import { collection, doc, DocumentSnapshot, getDocs, limit, orderBy, query, startAfter, writeBatch } from "firebase/firestore/lite"
import db from "../firebase/config"
import { firestoreHandler, FirestoreResponse } from "../firebase/firestoreService"
import { UpdateExpensesOverviewFields } from "@/types/overviews"
import { ExpensesFormInputGroupType } from "@/types/expenses"
import { COLLECTIONS } from "@/firebase/collections"
import { getUserSubCollectionPath } from "@/utils/service"

const EXPENSES_LIMIT = 40
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

export const getExpenses = async(uid: string) => {
    
    return firestoreHandler(async() => {
        const querySnapshot = await getDocs(
            query(
                collection(db, `${BASE_PATH + uid}/${COLLECTIONS.EXPENSES}`),
                orderBy("purchaseDate", "desc"),
                limit(EXPENSES_LIMIT)
            )
        )
        return querySnapshot.docs
    })
}

export const getAdditionalExpenses = async(
    snapshot: DocumentSnapshot,
    uid: string
) => {
    return firestoreHandler(async() => {
        const querySnapshot = await getDocs(
            query(
                collection(db, `${BASE_PATH + uid}/${COLLECTIONS.EXPENSES}`),
                orderBy("purchaseDate", "desc"),
                startAfter(snapshot),
                limit(EXPENSES_LIMIT)
            )
        )

        return querySnapshot.docs
    })
}