import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getCards } from "@/apis/cards"
import { openErrorModal, setErrorDetails } from "@/state/errorSlice"
import { CardDetailsType } from "@/types/cards"
import { DueDatesType, getBillingAndDueDate } from "@/utils/dates"
import { RootState } from "@/state/store"

type ReturnType = {
    creditCardsList: CardDetailsType[]
    isLoading: boolean
}

export const useFetchCards = (): ReturnType => {
    const { uid } = useSelector((state: RootState) => state.auth)
    const [creditCardsList, setCreditCardsList] = useState<CardDetailsType[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const dispatch = useDispatch()
    
    useEffect(() => {
        if (uid) {
            fetchCards(uid)
        }
    }, [uid])

    const fetchCards = async(userUid: string) => {
        const { success, data, error, errorCode } = await getCards(userUid)

        if (success && data?.docs) {
            const cards = [] as CardDetailsType[]

            data.docs.forEach(doc => {
                const { name, billingDay, color } = doc.data()
                const result: DueDatesType = getBillingAndDueDate(billingDay, 20)
                
                cards.push({
                    id: doc.id,
                    name: name,
                    billingDay: billingDay,
                    dueDate: result.paymentDueDate,
                    color: color
                })
            })
            setCreditCardsList(cards)
            setIsLoading(false)

            return
        }

        dispatch(setErrorDetails({
            message: error || "Unable to fetch your cards. Unknown error occured.",
            code: errorCode || 503
        }))
        dispatch(openErrorModal())
    }

    return {
        creditCardsList: creditCardsList,
        isLoading: isLoading
    }
}