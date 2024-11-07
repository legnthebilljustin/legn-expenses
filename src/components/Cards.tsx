import { useEffect, useState } from "react"
import { CardDetailsType, getCards } from "../apis/cards"
import { Card, CardBody, Spinner } from "@nextui-org/react"
import { useDispatch } from "react-redux"
import { openNotification, setNotificationMessage } from "../state/notificationSlice"
import { DueDatesType, getBillingAndDueDate } from "../utils/dates"

export default function Cards() {
    const [creditCards, setCreditCards] = useState<CardDetailsType[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const dispatch = useDispatch()

    useEffect(() => {
        const query = async() => {
            const { success, data, error } = await getCards()

            if (!success || !data?.docs) {
                dispatch(setNotificationMessage(error || "Unable to fetch cards."))
                dispatch(openNotification())

                return false
            }

            if (data?.docs.length === 0) {
                return setIsLoading(false)
            }

            if (data?.docs) {
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
                setCreditCards(cards)
                setIsLoading(false)
            }
        }

        query()
    }, [])

    if (isLoading) {
        return <Spinner label="Getting your cards..." color="primary" />
    }

    return (
        <div className="max-w-[600px]">
            {creditCards.map((card: CardDetailsType) => (
                <Card shadow="sm" className="mb-2" key={card.id}>
                    <CardBody className="px-4">
                        <div className="font-bold text-lg">{ card.name }</div>
                        <div>Due Date: { card.dueDate }</div>
                        <div className="text-gray-500">Statement Period: { card.billingDate }</div>
                        <div className="text-blue-300 text-sm">Billing Date: Every { card.billingDay } of the month.</div>
                    </CardBody>
                </Card>
            ))}
        </div>
    )
}