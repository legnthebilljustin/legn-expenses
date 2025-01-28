import { collection, doc, QueryDocumentSnapshot, getDocs, limit, orderBy, query, startAfter, where, writeBatch, getDoc, Timestamp, runTransaction } from "firebase/firestore/lite"
import db from "../firebase/config"
import { firestoreHandler, FirestoreResponse } from "../firebase/firestoreService"
import { UpdateExpensesOverviewFields } from "@/types/overviews"
import { EditExpensesDetailsType, ExpensesFormInputGroupType } from "@/types/expenses"
import { COLLECTIONS } from "@/firebase/collections"
import { getUserSubCollectionPath } from "@/utils/service"
import { COLLECTION_KEYS } from "@/constants/keys"
import { ExpenseSchema, OverviewSchema } from "@/schema"
import { FirestoreOverview } from "@/schema/overviewSchema"

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

const getPurchaseDateMonthAndYear = (date: Timestamp): { month: number, year: number } => {
    let month = 0
    let year = 0
    if (date instanceof Timestamp && date.seconds) {
        const newDate = new Timestamp(date.seconds, 0).toDate()

        month = newDate.getMonth() + 1
        year = newDate.getFullYear()
    }
    
    return { month, year }
}

const getExpensesItem = async(path: string, documentId: string) => {
    const docRef = doc(db, path, documentId)

    const snapshot = await getDoc(docRef)

    if (!snapshot.exists()) {
        throw new Error("Expenses item not found.")
    }
    return snapshot.data()
}

export const editExpensesItem = async(userUid: string, formData: EditExpensesDetailsType) => {
    const expensesPath = `${BASE_PATH + userUid}/${COLLECTIONS.EXPENSES}`
    const overviewPath = `${BASE_PATH + userUid}/${COLLECTIONS.OVERVIEW}`

    return firestoreHandler(async() => {
        try {
            const expensesSnapshot = await getExpensesItem(expensesPath, formData.id)
            const parsedResult = ExpenseSchema.safeParse(expensesSnapshot)

            if (!parsedResult.success) {
                throw new Error("Item in the server does not match the required format.")
            }

            const { price, purchaseDate } = parsedResult.data
            const { month, year } = getPurchaseDateMonthAndYear(purchaseDate as Timestamp)
            const diff = formData.price - price

            const overview = await getOverview(userUid, year, month)

            const expensesDocRef = doc(db, expensesPath, formData.id)
            const overviewDocRef = doc(db, overviewPath, overview.id)

            await runTransaction(db, async (transaction) => {
                transaction.update(expensesDocRef, {
                  price: formData.price,
                  itemName: formData.itemName,
                });

                transaction.update(overviewDocRef, {
                  amount: overview.amount + diff,
                });
            });
        } catch (error: any) {
            throw new Error(error.message || "Something went wrong. Cannot update expense.")
        }
    })
}

/**
 * TODO: functions below should be in the overview.api 
 * but that file needs to be refactored and cleaned up. transfer when ready
 */
const getOverview = async(userUid: string, year: number, month: number): Promise<FirestoreOverview & { id: string }> => {
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

    const parsedResult = OverviewSchema.safeParse(querySnapshot.docs[0].data())

    if (!parsedResult.success) {
        throw new Error("Overview data and schema mismatch.")
    }

    const parsed = parsedResult.data
    return {
        id: querySnapshot.docs[0].id,
        month: parsed.month, 
        year: parsed.year, 
        transactions: parsed.transactions, 
        amount: parsed.amount
    }
}