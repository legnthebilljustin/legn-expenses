import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { openErrorModal } from "@/state/errorSlice"
import { CardPaymentStatus, CardWithStatementType, CardsFetchType, CardForDropdownType } from "@/types/cards"
import { RootState } from "@/state/store"
import { QueryDocumentSnapshot, QuerySnapshot } from "firebase/firestore/lite"
import { getCardLatestStatement, getCards } from "@/apis/cards"
import { CARD_STATEMENT_PAYMENT_STATUS, CARDS_FETCH_TYPE } from "@/constants/others"
import CustomError from "@/utils/customError"
import { validateSchemaObject } from "@/utils/service"
import { StatementOfAccountSchema } from "@/schema"
import { FirestoreStatementOfAccount } from "@/schema/statementSchema"

type StatementDetailsProcessedType = {
    dueDate: string
    status: number
}

export const useFetchCards = (cardFetchType: CardsFetchType) => {
    const { uid } = useSelector((state: RootState) => state.auth)
    const [cardsForDropdown, setCardsForDropdown] = useState<CardForDropdownType[]>([])
    const [cardsForList, setCardsForList] = useState<CardWithStatementType[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const dispatch = useDispatch()
    
    useEffect(() => {
        if (uid && Object.values(CARDS_FETCH_TYPE).includes(cardFetchType)) {
            cardFetchType === CARDS_FETCH_TYPE.SELECT_DROPDOWN ? fetchBaseCards(uid) : fetchCardsWithStatement(uid) 
        }
    }, [uid, cardFetchType])

    const fetchNew = async(userUid: string): Promise<QuerySnapshot | void>=> {
        try {
            if (!userUid) {
                throw new CustomError("Invalid `userUid` parameter type.", 400) 
            }

            const cards = await getCards(userUid)

            return cards
        } catch (error: any) {
            dispatch(openErrorModal({
                message: error?.message || "Something went wrong. Unable to fetch your cards.",
                code: error?.code || 500
            }))
            
        }
    }

    const fetchBaseCards = async(userUid: string) => {
        const docs = await fetchNew(userUid)

        if (docs !== undefined) {
            
            const cardsList: CardForDropdownType[] = docs?.docs.map((doc: QueryDocumentSnapshot) => ({ 
                id: doc.id, 
                name: doc.data().name,
                color: doc.data().color
            }))

            setCardsForDropdown(cardsList)
            setIsLoading(false)
        }
    }

    const fetchCardsWithStatement = async(userUid: string) => {
        const docs = await fetchNew(userUid)

        if (docs !== undefined) {
            const cardsList: CardWithStatementType[] = await Promise.all(
                docs.docs.map(async(doc: QueryDocumentSnapshot) => {
                    const { name, billingDay, color } = doc.data()

                    const cardDetails = {
                        id: doc.id,
                        name, billingDay, color,
                        statement: {
                            id: "",
                            billingDate: "",
                            dueDate: "",
                            status: 0 as CardPaymentStatus
                        }
                    }

                    const statementDoc = await getCardLatestStatement(userUid, doc.id)
                    
                    if (statementDoc !== undefined && cardDetails.statement) {
                        const statement = statementDoc.data()
  
                        const { dueDate, status }: StatementDetailsProcessedType = handleCardData(statement as FirestoreStatementOfAccount)
                        cardDetails.statement.id = statementDoc.id
                        cardDetails.statement.dueDate = dueDate
                        cardDetails.statement.status = status as CardPaymentStatus
                    }

                    return cardDetails
                })
            )
            console.log('cardslist', cardsList)
            setCardsForList(cardsList)
            setIsLoading(false)
        }
    }

    /** i dont know what to name this yet lol */
    const handleCardData = (statement: FirestoreStatementOfAccount): StatementDetailsProcessedType => {
        const validatedData = validateSchemaObject(StatementOfAccountSchema, statement)

        const today = new Date()
        const dueDateForComparison = validatedData.dueDate.toDate() // convert Firestore timestamp to Javascript date bc Firestore's Timestamp have different methods for comparison
        
        
        let dueDate = "-"
        let status = statement.status || 0
        
        if (today.getTime() <= dueDateForComparison.getTime()) {
            dueDate = validatedData.dueDate.toDate().toDateString()
        } else {
            if (status !== CARD_STATEMENT_PAYMENT_STATUS.PAID) {
                dueDate = validatedData.dueDate.toDate().toDateString()
                status = CARD_STATEMENT_PAYMENT_STATUS.OVERDUE
            }
        }

        return {
            status, dueDate: dueDate
        }
    }

    return {
        cardsForDropdown,
        cardsForList,
        isLoading: isLoading
    }
}