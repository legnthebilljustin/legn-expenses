import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getCardPaymentByBillingDate, getCards } from "@/apis/cards"
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

        if (!data?.docs || !success) {
            dispatch(setErrorDetails({
                message: error || "Unable to fetch your cards. Unknown error occured.",
                code: errorCode || 503
            }))
            dispatch(openErrorModal())
            return
        }
        const cardsList: CardDetailsType[] = await Promise.all(
            data.docs.map(async(doc) => {
                const { name, billingDay, color, dueDaysAfterBilling } = doc.data()
                const result: DueDatesType = getBillingAndDueDate(billingDay, dueDaysAfterBilling)

                const payment = await getCardPaymentByBillingDate(userUid, doc.id, result.billingMonth, result.billingDay)

                return {
                    name, color, billingDay,
                    id: doc.id,
                    dueDate: result.paymentDueDate,
                    isPaid: payment.data?.length ? true : false,
                    billingMonth: result.billingMonth
                }
                /**
                 * NOTE: billingMonth and billingDay will be used to add a "payment" record to a card
                 */
            })
        )
        
        setCreditCardsList(cardsList)
        setIsLoading(false)
    }

    return {
        creditCardsList: creditCardsList,
        isLoading: isLoading
    }
}