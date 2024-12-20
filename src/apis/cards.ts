import { addDoc, collection, getDocs, limit, query, serverTimestamp, where } from "firebase/firestore/lite"
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

export const getCardPaymentByBillingDate = async(userUid: string, cardId: string, billingMonth: number, billingDay: number) => {
    return firestoreHandler(async() => {
        const path = `${BASE_PATH + userUid}/${COLLECTIONS.CARDS}/${cardId}/${COLLECTIONS.PAYMENTS}/`
        const today = new Date()
        const year = today.getFullYear()
        const paymentsRef = collection(db, path)
        const paymentQuery = query(
                    paymentsRef, 
                    where("billingMonth", "==", billingMonth),
                    where("billingDay", "==", billingDay),
                    where("billingYear", "==", year),
                    limit(1)
                )

        const result = await getDocs(paymentQuery)
        return result.docs
    })
}

export const addPaymentToCard = async(userUid: string, cardId: string, billingMonth: number, billingDay: number) => {
    return firestoreHandler(async() => {
        const path = `${BASE_PATH + userUid}/${COLLECTIONS.CARDS}/${cardId}/${COLLECTIONS.PAYMENTS}`
        const today = new Date()
        const year = today.getFullYear()
        return await addDoc(
            collection(db, path), {
                billingMonth, billingDay,
                billingYear: year,
                createdAt: serverTimestamp()
            }
        )
    })
}