import { addDoc, collection, doc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, QuerySnapshot, updateDoc } from "firebase/firestore/lite"
import db from "../firebase/config"
import { BASE_PATH, COLLECTIONS } from "../firebase/collections"
import { CardFormInputType } from "@/types/cards"
import { isAValidString } from "@/utils/misc"
import { CARD_STATEMENT_PAYMENT_STATUS } from "@/constants/others"
import { CustomError } from "@/utils/customError"

export const getCards = async(userUid: string): Promise<QuerySnapshot> => {
    try {
        const result = await getDocs(
            query(
                collection(db, `${BASE_PATH + userUid}/${COLLECTIONS.CARDS}`)
            )
        )

        return result
    } catch (error: any) {
        throw new CustomError(
            error?.message || "Something went wrong. Unable to fetch cards.",
            error?.code
        )
    }
}

export const addCard = async(cardFormData: CardFormInputType, userUid: string) => {
    try {
        await addDoc(
            collection(db, `${BASE_PATH + userUid}/${COLLECTIONS.CARDS}`),
            cardFormData
        )
    } catch (error: any) {
        throw new CustomError(
            error?.message || "Something went wrong. Unable to add a new card.",
            error?.code
        )
    }
}

export const getCardLatestStatement = async(userUid: string, cardUid: string): Promise<QueryDocumentSnapshot> => {
    if (!userUid || !cardUid || !isAValidString(userUid) || !isAValidString(cardUid)) {
        throw new CustomError("Invalid parameter type provided.", 400)
    }

    try {
        const path = `${BASE_PATH + userUid}/${COLLECTIONS.CARDS}/${cardUid}/${COLLECTIONS.CARD_STATEMENTS}`

        const querySnapshot = await getDocs(
            query(
                collection(db, path),
                orderBy("billingDate", "desc"),
                limit(1)
            )
        )

        return querySnapshot.docs[0]
    } catch (error: any) {
        throw new CustomError(
            error?.message || "Something went wrong. Unable to get card's latest statement.",
            error?.code
        )
    }
}

export const markCardStatementAsPaidApi = async(userUid: string, cardUid: string, statementUid: string) => {
    if (!isAValidString(userUid) || !isAValidString(cardUid) || !isAValidString(statementUid)) {
        throw new CustomError("Invalid parameter type provided.", 400)
    }

    try {
        const path = `${BASE_PATH + userUid}/${COLLECTIONS.CARDS}/${cardUid}/${COLLECTIONS.CARD_STATEMENTS}`

        const statementRef = doc(db, path, statementUid)
        
        return await updateDoc(statementRef, {
            status: CARD_STATEMENT_PAYMENT_STATUS.PAID
        })
    } catch (error: any) {
        throw new CustomError(
            error?.message || "Something went wrong. Unable to mark statement as paid.",
            error?.code
        )
    }
}