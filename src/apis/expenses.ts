import { collection, doc, DocumentSnapshot, getDocs, limit, orderBy, query, startAfter, writeBatch } from "firebase/firestore/lite"
import db from "../firebase/config"
import { ExpensesInputGroupType } from "../components/AddExpenses"
import { firestoreHandler } from "../firebase/firestoreService"

const EXPENSES_LIMIT = 15

const collectionName = {
    PRODUCTION: "expenses",
    // PRODUCTION: "expenses_testing"
}

export const addExpenses = async(formData: ExpensesInputGroupType[]) => {
    return firestoreHandler(async() => {
        const batch = writeBatch(db)
        const collectionRef = collection(db, collectionName.PRODUCTION)

        formData.forEach(item => {
            const docRef = doc(collectionRef)
            batch.set(docRef, item)    
        });

        await batch.commit()

        return "Expenses items list saved."
    })
}

export const getTExpenses = async() => {
    return firestoreHandler(async() => {
        const querySnapshot = await getDocs(
            query(
                collection(db, collectionName.PRODUCTION),
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
                collection(db, collectionName.PRODUCTION),
                orderBy("purchaseDate", "desc"),
                startAfter(snapshot),
                limit(EXPENSES_LIMIT)
            )
        )

        return querySnapshot
    })
}