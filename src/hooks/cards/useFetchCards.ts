import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { openErrorModal, setErrorDetails } from "@/state/errorSlice"
import { CardPaymentStatus, FirestoreCardStatement, CardWithStatementType, CardsFetchType, CardForDropdownType } from "@/types/cards"
import { RootState } from "@/state/store"
import { QueryDocumentSnapshot, QuerySnapshot } from "firebase/firestore/lite"
import { getCardLatestStatement, getCards } from "@/apis/cards"
import { CARD_STATEMENT_PAYMENT_STATUS, CARDS_FETCH_TYPE } from "@/constants/others"

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

    const fetchNew = async(userUid: string): Promise<QuerySnapshot | undefined>=> {
        if (!userUid) {
            throw new Error("Invalid `userUid` parameter type.") 
        }

        const { success, data, error, errorCode } = await getCards(userUid)

        if (success && data) {
            return data
        }


        dispatch(setErrorDetails({
            message: error || "Unable to fetch your cards. Unknown error occured.",
            code: errorCode || 503
        }))
        dispatch(openErrorModal())

        return undefined
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

                    const statement = await getCardLatestStatement(userUid, doc.id)

                    if (statement?.data !== undefined && cardDetails.statement) {
                        const { dueDate, status }: StatementDetailsProcessedType = handleCardData(statement.data.data())
                        cardDetails.statement.id = statement.data.id
                        cardDetails.statement.dueDate = dueDate
                        cardDetails.statement.status = status as CardPaymentStatus
                    }

                    return cardDetails
                })
            )

            setCardsForList(cardsList)
            setIsLoading(false)
        }
    }

    /** i dont know what to name this yet lol */
    const handleCardData = (statement: FirestoreCardStatement): StatementDetailsProcessedType => {
        const today = new Date()
        const dueDateForComparison = statement.dueDate.toDate() // convert Firestore timestamp to Javascript date bc Firestore's Timestamp have different methods for comparison
        
        let dueDate = "-"
        let status = statement.status || 0
        
        if (today.getTime() <= dueDateForComparison.getTime()) {
            dueDate = statement.dueDate.toDate().toDateString()
        } else {
            if (status !== CARD_STATEMENT_PAYMENT_STATUS.PAID) {
                dueDate = statement.dueDate.toDate().toDateString()
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