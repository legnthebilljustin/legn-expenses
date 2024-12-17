import { Spinner } from "@nextui-org/react"
import { CardDetailsType } from "@/types/cards"
import { useFetchCards } from "@/hooks/cards/useFetchCards"
import { AddCardForm, CardItem, PageHeading } from "@/components"

export default function Cards() {
    const { creditCardsList, isLoading } = useFetchCards()

    if (isLoading) {
        return <Spinner label="Getting your cards..." color="primary" />
    }

    return (
        <div>
            <PageHeading heading="Your Active Credit Cards" />
            <div className="text-center mb-8">
                <p className="text-sm mb-2">Listed below are your cards' payment schedules and status.</p>
                <AddCardForm />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 p-4">
            {creditCardsList.map((card: CardDetailsType) => (
                <CardItem key={card.id} card={card} />
            ))}
            </div>
        </div>
    )
}

