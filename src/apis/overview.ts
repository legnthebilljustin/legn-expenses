import { collection, doc, getDocs, increment, query, QuerySnapshot, setDoc, updateDoc, where, writeBatch } from "firebase/firestore/lite"
import { firestoreHandler } from "../firebase/firestoreService"
import collections from "../firebase/collections"
import db from "../firebase/config"
import { UpdateExpensesOverviewFields } from "@/types/overviews"

const USER_ID = "Txd6N06oq8dOoQWP3fTc"

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
        const userOverviewRef = doc(db, `users/${userId}/${collections.OVERVIEW}/${customId}`)

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

        const userExpensesRef = doc(db, `users/${userId}/${collections.EXPENSES}/2024/10/${expenseDoc.id}`)
        
        batch.set(userExpensesRef, expenseData)

        batch.delete(doc(db, collections.EXPENSES, expenseDoc.id))
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
    const expensesRef = collection(db, collections.EXPENSES)
    const monthQuery = query(
        expensesRef,
        where("purchaseDate", ">=", startDate),
        where("purchaseDate", "<=", endDate)
    )
    const querySnapshot = await getDocs(monthQuery)

    return querySnapshot
}