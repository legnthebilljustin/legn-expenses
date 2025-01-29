import { collection, doc, QueryDocumentSnapshot, getDocs, limit, orderBy, query, startAfter, where, writeBatch, getDoc, Timestamp, runTransaction } from "firebase/firestore/lite"
import db from "../firebase/config"
import { firestoreHandler, FirestoreResponse } from "../firebase/firestoreService"
import { UpdateExpensesOverviewFields } from "@/types/overviews"
import { EditExpensesDetailsType, ExpensesFormInputGroupType } from "@/types/expenses"
import { COLLECTIONS } from "@/firebase/collections"
import { getUserSubCollectionPath, validateSchemaObject } from "@/utils/service"
import { COLLECTION_KEYS } from "@/constants/keys"
import { ExpenseSchema } from "@/schema"
import { FirestoreExpense } from "@/schema/expenseSchema"
import { getOverviewDocument } from "./overview"

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

const getExpensesItem = async(path: string, documentId: string): Promise<FirestoreExpense> => {
    const docRef = doc(db, path, documentId)

    const snapshot = await getDoc(docRef)

    if (!snapshot.exists()) {
        throw new Error("Expenses item not found.")
    }

    const parsed = ExpenseSchema.safeParse(snapshot.data())

    if (!parsed.success) {
        throw new Error("Item in the server does not match the required format.")
    }
    return parsed.data
}

export const editExpensesItem = async(userUid: string, formData: EditExpensesDetailsType) => {
    const expensesPath = `${BASE_PATH + userUid}/${COLLECTIONS.EXPENSES}`
    const overviewPath = `${BASE_PATH + userUid}/${COLLECTIONS.OVERVIEW}`

    return firestoreHandler(async() => {
        try {
            const expensesSnapshot = await getExpensesItem(expensesPath, formData.id)
            const parsedExpensesData: FirestoreExpense = validateSchemaObject(ExpenseSchema, expensesSnapshot)

            const { price, purchaseDate } = parsedExpensesData
            const { month, year } = getPurchaseDateMonthAndYear(purchaseDate as Timestamp)
            const diff = formData.price - price

            const overview = await getOverviewDocument(userUid, year, month)

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

export const deleteExpensesItem = async(userUid: string, expensesItemUid: string) => {
    const expensesPath = `${BASE_PATH + userUid}/${COLLECTIONS.EXPENSES}`
    const overviewPath = `${BASE_PATH + userUid}/${COLLECTIONS.OVERVIEW}`

    try {
        const expensesItem = await getExpensesItem(expensesPath, expensesItemUid)

        const { month, year } = getPurchaseDateMonthAndYear(expensesItem.purchaseDate as Timestamp)

        const overview = await getOverviewDocument(userUid, year, month)

        const expensesDocRef = doc(db, expensesPath, expensesItemUid)
        const overviewDocRef = doc(db, overviewPath, overview.id)

        await runTransaction(db, async(transaction) => {
            transaction.update(overviewDocRef, {
                amount: overview.amount - expensesItem.price
            })

            transaction.delete(expensesDocRef)
        })

    } catch (error: any) {
        throw new Error(error.message || "Something went wrong. Cannot delete expenses item.")
    }
}