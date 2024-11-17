import { collection, getDocs, query } from "firebase/firestore/lite"
import { firestoreHandler } from "../firebase/firestoreService"
import db from "../firebase/config"
import collections from "../firebase/collections"

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