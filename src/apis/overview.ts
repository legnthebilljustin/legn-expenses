import { addDoc, collection, doc, getDocs, increment, limit, orderBy, query, QueryDocumentSnapshot, updateDoc, where } from "firebase/firestore/lite"
import db from "../firebase/config"
import { BASE_PATH, COLLECTIONS } from "@/firebase/collections"
import { FirestoreOverview, OverviewSchema } from "@/schema/overviewSchema"
import { validateSchemaObject } from "@/utils/service"
import { ExpensesMetrics } from "@/types/expenses"
import CustomError from "@/utils/customError"

export const getAllExpensesOverviewApi = async(userUid: string): Promise<QueryDocumentSnapshot[] | null> => {
    if (typeof userUid !== "string") {
        throw "Invalid parameter provided."
    }

    try {
        const path = `${BASE_PATH + userUid}/${COLLECTIONS.OVERVIEW}`
        const overviewCollection = collection(db, path)

        /**
         * Firestore queries requires a `composite index` when you order by multiple fields. if not properly set up, queries will return 400
         * Solution: create a composite index via Firestore Console, in the Indexes tab
         * setting up/update might take a while. wait until status is "Enabled"
         */
        const overviewQuery = query(overviewCollection, orderBy("year", "desc"), orderBy("month", "desc"))

        const querySnapshot = await getDocs(overviewQuery)
        const result = querySnapshot.docs.length ? querySnapshot.docs : null

        return result
    } catch (error: any) {
        throw new CustomError(
            error?.message || "Unable to get expenses overview.",
            error?.code
        )
    }
}

export const getOverviewDocument = async(
    userUid: string, year: number, month: number
): Promise<FirestoreOverview & { id: string } | null> => {

    const path = `${BASE_PATH + userUid}/${COLLECTIONS.OVERVIEW}`
    const collectionRef = collection(db, path)
    const overviewQuery = query(collectionRef, 
        where("year", "==", year),
        where("month", "==", month),
        limit(1)
    )

    const querySnapshot = await getDocs(overviewQuery)

    if (querySnapshot.empty) {
        /**
         * DO NOT THROW AN ERROR HERE (see useAddExpenses.ts - handleExpensesFormSubmit())
         * when adding new expenses, function needs to know if a document exists or not to determine wether to update or create
         */
        return null
    }
    const validatedData: FirestoreOverview = validateSchemaObject(OverviewSchema, querySnapshot.docs[0].data())

    return {
        id: querySnapshot.docs[0].id,
        ...validatedData
    }
}

export const createOverview = async(userUid: string, overviewData: FirestoreOverview): Promise<void> => {
    const path = `${BASE_PATH + userUid}/${COLLECTIONS.OVERVIEW}`
    await addDoc(collection(db, path), overviewData)
}

export const updateOverview = async(userUid: string, docId: string, updateData: ExpensesMetrics): Promise<void> => {
    const path = `${BASE_PATH + userUid}/${COLLECTIONS.OVERVIEW}`
    const docRef = doc(db, path, docId)

    await updateDoc(docRef, {
        amount: increment(updateData.amount),
        transactions: increment(updateData.transactions)
    })
}