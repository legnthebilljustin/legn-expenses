import { addDoc, collection, doc, getDocs, increment, limit, orderBy, query, updateDoc, where } from "firebase/firestore/lite"
import { firestoreHandler } from "../firebase/firestoreService"
import db from "../firebase/config"
import { UpdateExpensesOverviewFields } from "@/types/overviews"
import { BASE_PATH, COLLECTIONS } from "@/firebase/collections"
import { FirestoreOverview, OverviewSchema } from "@/schema/overviewSchema"
import { validateSchemaObject } from "@/utils/service"

export const findAndUpdateExpensesOverview = async(userUid: string, formData: UpdateExpensesOverviewFields) => {
    return firestoreHandler(async() => {
        const today = new Date()
        const month = today.getMonth() + 1
        const year = today.getFullYear()
        const result = await getCurrentMonthOverview(userUid, year, month)
        
        if (result.data === null) {
            return await createCurrentMonthOverview(userUid, formData, year, month)
        }

        const docId = result.data?.id

        if (docId) {
            return await updateCurrentMonthOverview(userUid, docId, formData)
        }

        throw new Error("Unable to update this month's overview.");
    })
}

export const getAllExpensesOverviewApi = async(userUid: string) => {
    if (typeof userUid !== "string") {
        throw "Invalid parameter provided."
    }

    return firestoreHandler(async() => {
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
    })
}

export const getOverviewDocument = async(userUid: string, year: number, month: number) => {
    const path = `${BASE_PATH + userUid}/${COLLECTIONS.OVERVIEW}`
    const collectionRef = collection(db, path)
    const overviewQuery = query(collectionRef, 
        where("year", "==", year),
        where("month", "==", month),
        limit(1)
    )

    const querySnapshot = await getDocs(overviewQuery)

    if (querySnapshot.empty) {
        throw new Error("Overview not found.")
    }
    const validatedData: FirestoreOverview = validateSchemaObject(OverviewSchema, querySnapshot.docs[0].data())

    return {
        id: querySnapshot.docs[0].id,
        ...validatedData
    }
}

/**
 * get overview document for the currenth month
 * @returns 
 */
const getCurrentMonthOverview = async(userUid: string, year: number, month: number) => {
    return firestoreHandler(async() => {
        
        const overviewCollection = collection(db, `${BASE_PATH + userUid}/${COLLECTIONS.OVERVIEW}`)
        const overviewQuery = query(overviewCollection, 
                where("year", "==", year),
                where("month", "==", month),
                limit(1)
            )

        const querySnapshot = await getDocs(overviewQuery)
        
        const result = querySnapshot.docs.length ? querySnapshot.docs[0] : null
        return result
    })
}

const createCurrentMonthOverview = async(userUid: string, monthlyOverviewData: UpdateExpensesOverviewFields, year: number, month: number) => {
    return firestoreHandler(async() => {
        const path = `${BASE_PATH + userUid}/${COLLECTIONS.OVERVIEW}`
        const overviewRef = await addDoc(collection(db, path), {
            month: month,
            year: year,
            amount: monthlyOverviewData.amount || 0,
            transactions: monthlyOverviewData.transactions || 0
        })

        return overviewRef
    })
}

const updateCurrentMonthOverview = async(userUid: string, docId: string, updateData: UpdateExpensesOverviewFields) => {
    return firestoreHandler(async() => {
        const path = `${BASE_PATH + userUid}/${COLLECTIONS.OVERVIEW}`
        const docRef = doc(db, path, docId)

        await updateDoc(docRef, {
            amount: increment(updateData.amount),
            transactions: increment(updateData.transactions)
        })
    })
}