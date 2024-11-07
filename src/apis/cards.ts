import { collection, getDocs, query } from "firebase/firestore/lite"
import { firestoreHandler } from "../firebase/firestoreService"
import db from "../firebase/config"
import collections from "../firebase/collections"

export type CardDetailsType = {
    id?: string
    name: string
    billingDay: number
    dueDaysAfterBilling: number
    billingDate?: string
    dueDate?: string
}

export const getCards = () => {
    return firestoreHandler(async() => {
        const result = await getDocs(
            query(
                collection(db, collections.CARDS)
            )
        )
        console.log("i got here")
        return result
    })
}