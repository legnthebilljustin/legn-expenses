import { Card, CardBody, Spinner } from "@nextui-org/react"
import { CardDetailsType } from "@/types/cards"
import { useFetchCards } from "@/hooks/cards/useFetchCards"

export default function Cards() {
    const { creditCardsList, isLoading } = useFetchCards()

    if (isLoading) {
        return <Spinner label="Getting your cards..." color="primary" />
    }

    return (
        <div className="max-w-[600px]">
            {creditCardsList.map((card: CardDetailsType) => (
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