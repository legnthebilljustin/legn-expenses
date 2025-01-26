import { addDoc, collection, doc, getDocs, limit, orderBy, query, updateDoc } from "firebase/firestore/lite"
import { firestoreHandler, FirestoreResponse } from "../firebase/firestoreService"
import db from "../firebase/config"
import { BASE_PATH, COLLECTIONS } from "../firebase/collections"
import { CardFormInputType } from "@/types/cards"
import { isAValidString } from "@/utils/misc"
import { CARD_STATEMENT_PAYMENT_STATUS } from "@/constants/others"

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

export const getCardLatestStatement = async(userUid: string, cardUid: string): Promise<FirestoreResponse> => {
    if (!userUid || !cardUid || !isAValidString(userUid) || !isAValidString(cardUid)) {
        throw { message: "Invalid parameter type provided.", code: 400 }
    }

    return firestoreHandler(async() => {
        const path = `${BASE_PATH + userUid}/${COLLECTIONS.CARDS}/${cardUid}/${COLLECTIONS.CARD_STATEMENTS}`

        const querySnapshot = await getDocs(
            query(
                collection(db, path),
                orderBy("billingDate", "desc"),
                limit(1)
            )
        )

        return querySnapshot.docs[0]
    })
}

export const markCardStatementAsPaidApi = async(userUid: string, cardUid: string, statementUid: string) => {
    if (!isAValidString(userUid) || !isAValidString(cardUid) || !isAValidString(statementUid)) {
        throw { message: "Invalid parameter type provided.", code: 400 }
    }

    return firestoreHandler(async() => {
        const path = `${BASE_PATH + userUid}/${COLLECTIONS.CARDS}/${cardUid}/${COLLECTIONS.CARD_STATEMENTS}`

        const statementRef = doc(db, path, statementUid)
        
        return await updateDoc(statementRef, {
            status: CARD_STATEMENT_PAYMENT_STATUS.PAID
        })
    })
}