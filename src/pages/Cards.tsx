import { Spinner } from "@nextui-org/react"
import { CardWithStatementType } from "@/types/cards"
import { useFetchCards } from "@/hooks/cards/useFetchCards"
import { AddCardForm, CardItem, PageHeading } from "@/components"
import { useSelector } from "react-redux"
import { RootState } from "@/state/store"
import { CONFIRMATION_TYPES } from "@/state/confirmationSlice"
import { useEffect } from "react"
import { usePayStatement,  } from "@/hooks"
import { CARDS_FETCH_TYPE } from "@/constants/others"

export type DeleteCardProps = {
    cardUid: string
    cardName: string
}

export default function Cards() {
    const { cardsForList, isLoading } = useFetchCards(CARDS_FETCH_TYPE.LIST)
    const { actionConfirmed, type } = useSelector((state: RootState) => state.confirmation)

    const {
        isDoingPayment,
        handleOnPayCardStatement,
        payCardStatement
    } = usePayStatement()

    useEffect(() => {
        if (actionConfirmed) {
            type === CONFIRMATION_TYPES.ACTION ? payCardStatement() : ""
        }
    }, [actionConfirmed]);
    
    if (isLoading) {
        return <Spinner label="Getting your cards..." color="primary" />
    }

    if (isDoingPayment) {
        return <Spinner label="Processing card statement payment..." color="primary" />
    }

    return (
        <div>
            <PageHeading heading="Your Active Credit Cards" />
            <div className="text-center mb-8">
                <p className="text-sm mb-2">Listed below are your cards' payment schedules and status.</p>
                <AddCardForm />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 p-4">
            {cardsForList.map((card: CardWithStatementType) => (
                <CardItem key={card.id} card={card} onPayCardStatement={handleOnPayCardStatement} />
            ))}
            </div>
        </div>
    )
}

