import { addDoc, collection, getDocs, query } from "firebase/firestore/lite"
import { firestoreHandler } from "../firebase/firestoreService"
import db from "../firebase/config"
import { BASE_PATH, COLLECTIONS } from "../firebase/collections"
import { CardFormInputType } from "@/types/cards"

export const getCards = (userUid: string) => {
    return firestoreHandler(async() => {
        const result = await getDocs(
            query(
                collection(db, `${BASE_PATH + userUid}/${COLLECTIONS.CARDS}`)
            )
        )
        return result
    })
}

export const addCard = async(cardFormData: CardFormInputType, userUid: string) => {
    return firestoreHandler(async() => {
        return await addDoc(
            collection(db, `${BASE_PATH + userUid}/${COLLECTIONS.CARDS}`),
            cardFormData
        )
    })
}