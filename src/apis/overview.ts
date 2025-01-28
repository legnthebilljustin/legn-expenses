import { addDoc, collection, doc, getDocs, increment, limit, orderBy, query, QuerySnapshot, setDoc, updateDoc, where, writeBatch } from "firebase/firestore/lite"
import { firestoreHandler } from "../firebase/firestoreService"
import db from "../firebase/config"
import { UpdateExpensesOverviewFields } from "@/types/overviews"
import { BASE_PATH, COLLECTIONS } from "@/firebase/collections"

// TODO: This needs clean up and refactor
const USER_ID = "Txd6N06oq8dOoQWP3fTc"

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

export const migrateMonthlyExpenses = async() => {
    const expensesSnapshot = await getMonthAndYearExpenses(10, 2024)
    const totalData = await createUsersSubCollectionAndTotal(expensesSnapshot , USER_ID)

    if (totalData?.amount && totalData?.transactions) {

        addMonthlyOverviewRecord(USER_ID, 2024, 10, totalData.amount, totalData.transactions)
    }
}

const addMonthlyOverviewRecord = async(
    userId: string, 
    year: number,
    month: number,
    amount: number, 
    transactions: number
) => {
    try {
        const customId = `${year}${month}`
        const userOverviewRef = doc(db, `users/${userId}/${COLLECTIONS.OVERVIEW}/${customId}`)

        const data = {
            amount, transactions
        }

        await setDoc(userOverviewRef, data)
    } catch (err) {
        console.log('error', err)
    }
}

const createUsersSubCollectionAndTotal = async(
    expensesSnapshot: QuerySnapshot, 
    userId: string
) => {
    const batch = writeBatch(db)

    let totalAmount = 0
    let totalTransactions = 0

    expensesSnapshot.forEach(expenseDoc => {
        const expenseData = expenseDoc.data()

        totalAmount += expenseData.price
        totalTransactions += 1

        const userExpensesRef = doc(db, `users/${userId}/${COLLECTIONS.EXPENSES}/2024/10/${expenseDoc.id}`)
        
        batch.set(userExpensesRef, expenseData)

        batch.delete(doc(db, COLLECTIONS.EXPENSES, expenseDoc.id))
    }) 

    await batch.commit()

    return {
        amount: totalAmount,
        transactions: totalTransactions
    }
    
}

const getMonthAndYearExpenses = async(month: number, year: number): Promise<QuerySnapshot> => {
    
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    const expensesRef = collection(db, COLLECTIONS.EXPENSES)
    const monthQuery = query(
        expensesRef,
        where("purchaseDate", ">=", startDate),
        where("purchaseDate", "<=", endDate)
    )
    const querySnapshot = await getDocs(monthQuery)

    return querySnapshot
}