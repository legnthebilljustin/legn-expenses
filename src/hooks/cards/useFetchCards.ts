import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { getCards } from "@/apis/cards"
import { openErrorModal, setErrorDetails } from "@/state/errorSlice"
import { CardDetailsType } from "@/types/cards"
import { DueDatesType, getBillingAndDueDate } from "@/utils/dates"

type ReturnType = {
    creditCardsList: CardDetailsType[]
    isLoading: boolean
}

export const useFetchCards = (): ReturnType => {
    const [creditCardsList, setCreditCardsList] = useState<CardDetailsType[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const dispatch = useDispatch()
    
    useEffect(() => {
        fetchCards()
    }, [])

    const fetchCards = async() => {
        const { success, data, error, errorCode } = await getCards()

        if (success && data?.docs) {
            const cards = [] as CardDetailsType[]

            data.docs.forEach(doc => {
                const { name, billingDay, dueDaysAfterBilling } = doc.data()
                const result: DueDatesType = getBillingAndDueDate(billingDay, 20)
                
                cards.push({
                    id: doc.id,
                    name: name,
                    billingDay: billingDay,
                    dueDaysAfterBilling: dueDaysAfterBilling,
                    dueDate: result.paymentDueDate,
                    billingDate: result.billingDate
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