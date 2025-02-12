import { collection, doc, QueryDocumentSnapshot, getDocs, limit, orderBy, query, startAfter, where, writeBatch, getDoc, Timestamp, runTransaction } from "firebase/firestore/lite"
import db from "../firebase/config"
import { EditExpensesDetailsType, ExpensesFormInputGroupType, ExpensesMetrics } from "@/types/expenses"
import { BASE_PATH, COLLECTIONS } from "@/firebase/collections"
import { validateSchemaObject } from "@/utils/service"
import { COLLECTION_KEYS } from "@/constants/keys"
import { ExpenseSchema } from "@/schema"
import { FirestoreExpense } from "@/schema/expenseSchema"
import { getOverviewDocument } from "./overview"
import CustomError from "@/utils/customError"

export const EXPENSES_LIMIT = 50
const BASE_PATH_2 = `${COLLECTIONS.USERS}/`

export const addExpensesAPI = async(
    userUid: string,
    formData: ExpensesFormInputGroupType[],
): Promise<ExpensesMetrics> => {
    const path = `${BASE_PATH + userUid}/${COLLECTIONS.EXPENSES}`

    try {
        const batch = writeBatch(db)
        const collectionRef = collection(db, path)

        let totalAmount = 0

        formData.forEach((item: ExpensesFormInputGroupType) => {
            const docRef = doc(collectionRef)
            totalAmount += item.price
            batch.set(docRef, item)    
        });

        await batch.commit()

        return {
            amount: totalAmount,
            transactions: formData.length
        }
    } catch (error) {
        throw new CustomError("Unable to add expenses", 400)
    }
}

export const getExpenses = async(userUid: string): Promise<QueryDocumentSnapshot[]> => {
    try {
        const querySnapshot = await getDocs(
            query(
                collection(db, `${BASE_PATH_2 + userUid}/${COLLECTIONS.EXPENSES}`),
                orderBy("purchaseDate", "desc"),
                limit(EXPENSES_LIMIT)
            )
        )
        return querySnapshot.docs
    } catch (error) {
        throw new CustomError("Unable to get expenses.", 400)
    }
}

export const getAdditionalExpenses = async(
    snapshot: QueryDocumentSnapshot,
    userUid: string
): Promise<QueryDocumentSnapshot[]> => {

    try {
        const querySnapshot = await getDocs(
            query(
                collection(db, `${BASE_PATH_2 + userUid}/${COLLECTIONS.EXPENSES}`),
                orderBy("purchaseDate", "desc"),
                startAfter(snapshot),
                limit(EXPENSES_LIMIT)
            )
        )
        return querySnapshot.docs
    } catch (error) {
        throw new CustomError('Unable to get additional expenses.', 400)
    }
}

export const getExpensesByDateRange = async(userUid: string, startDate: any, endDate: any): Promise<QueryDocumentSnapshot[]> => {
    try {
        const querySnapshot = await getDocs(
            query(
                collection(db, `${BASE_PATH_2 + userUid}/${COLLECTIONS.EXPENSES}`),
                orderBy(COLLECTION_KEYS.PURCHASE_DATE, "desc"),
                where(COLLECTION_KEYS.PURCHASE_DATE, ">=", startDate),
                where(COLLECTION_KEYS.PURCHASE_DATE, "<=", endDate)
            )
        )

        return querySnapshot.docs
    } catch (error: any) {
        throw new CustomError(
            error?.message || 'Unable to get additional expenses.',
            error?.code
        )
    }
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
        throw new CustomError("Expenses item not found.", 404)
    }

    const parsed = ExpenseSchema.safeParse(snapshot.data())

    if (!parsed.success) {
        throw new CustomError("Item in the server does not match the required format.", 422)
    }
    return parsed.data
}

export const editExpensesItem = async(userUid: string, formData: EditExpensesDetailsType) => {
    const expensesPath = `${BASE_PATH_2 + userUid}/${COLLECTIONS.EXPENSES}`
    const overviewPath = `${BASE_PATH_2 + userUid}/${COLLECTIONS.OVERVIEW}`

    try {
        const expensesSnapshot = await getExpensesItem(expensesPath, formData.id)
        const parsedExpensesData: FirestoreExpense = validateSchemaObject(ExpenseSchema, expensesSnapshot)

        const { price, purchaseDate } = parsedExpensesData
        const { month, year } = getPurchaseDateMonthAndYear(purchaseDate as Timestamp)
        const diff = formData.price - price

        const overview = await getOverviewDocument(userUid, year, month)

        if (overview === null) {
            throw new Error("Overview document not found.")
        }

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

        return await getDoc(expensesDocRef)
    } catch (error: any) {
        throw new CustomError(
            error?.message || "Something went wrong. Cannot update expense item.",
            error?.code
        )
    }
}

export const deleteExpensesItem = async(userUid: string, expensesItemUid: string) => {
    const expensesPath = `${BASE_PATH_2 + userUid}/${COLLECTIONS.EXPENSES}`
    const overviewPath = `${BASE_PATH_2 + userUid}/${COLLECTIONS.OVERVIEW}`

    try {
        const expensesItem = await getExpensesItem(expensesPath, expensesItemUid)

        const { month, year } = getPurchaseDateMonthAndYear(expensesItem.purchaseDate as Timestamp)

        const overview = await getOverviewDocument(userUid, year, month)

        if (overview === null) {
            throw new CustomError("Overview document not found.", 400)
        }

        const expensesDocRef = doc(db, expensesPath, expensesItemUid)
        const overviewDocRef = doc(db, overviewPath, overview.id)

        await runTransaction(db, async(transaction) => {
            transaction.update(overviewDocRef, {
                amount: overview.amount - expensesItem.price
            })

            transaction.delete(expensesDocRef)
        })

    } catch (error: any) {
        throw new CustomError(
            error?.message || "Something went wrong. Cannot delete expense item.",
            error?.code
        )
    }
}