import { collection, doc, getDocs, writeBatch } from "firebase/firestore/lite"
import db from "../firebase/config"
import { ExpensesInputGroupType } from "../components/AddExpenses"

const collectionName = "expenses"

export const addExpenses = async(formData: ExpensesInputGroupType[]) => {
    const batch = writeBatch(db)
    const collectionRef = collection(db, collectionName)

    try {
        formData.forEach(item => {
            const docRef = doc(collectionRef)
            batch.set(docRef, item)    
        });

        await batch.commit()
        console.log("All expenses have been saved.")
    } catch (error) {
        console.error("something went wrong")
    }
}

export const getTExpenses = async() => {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName))
        return querySnapshot
    } catch (error) {
        console.error("unable to fetch expenses")
    }
}