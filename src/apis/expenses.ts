import { collection, doc, getDocs, writeBatch } from "firebase/firestore/lite"
import db from "../firebase/config"
import { ExpensesInputGroupType } from "../components/AddExpenses"
import { firestoreHandler } from "../firebase/firestoreService"

const collectionName = {
    PRODUCTION: "expenses",
    DEVELOPMENT: "expenses_testing"
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
    
    try {
        const querySnapshot = await getDocs(collection(db, collectionName.DEVELOPMENT))
        return querySnapshot
    } catch (error) {
        console.error("unable to fetch expenses")
    }
}