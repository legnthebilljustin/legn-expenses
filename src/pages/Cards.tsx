import { Spinner } from "@nextui-org/react"
import { CardDetailsType } from "@/types/cards"
import { useFetchCards } from "@/hooks/cards/useFetchCards"
import { AddCardForm, CardItem, PageHeading } from "@/components"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/state/store"
import { closeConfirmationModal, CONFIRMATION_TYPES, openConfirmationModal } from "@/state/confirmationSlice"
import { useEffect, useState } from "react"
import { useCardPayment } from "@/hooks"
import { openErrorModal, setErrorDetails } from "@/state/errorSlice"
import { openNotification, setNotificationMessage } from "@/state/notificationSlice"

export type CardActionProps = {
    card: CardDetailsType
    type: string
}

export default function Cards() {
    const userUid = useSelector((state: RootState) => state.auth.uid)
    const { creditCardsList, isLoading } = useFetchCards()
    const dispatch = useDispatch()
    const actionConfirmed = useSelector((state: RootState) => state.confirmation.actionConfirmed)
    const [cardForPendingAction, setCardForPendingAction] = useState<CardDetailsType | null>(null)
    const { markCardAsPaid } = useCardPayment()

    useEffect(() => {
        if (actionConfirmed) {
            handleMarkAsPaidConfirmation()
        }
    }, [actionConfirmed]);
    
    if (isLoading) {
        return <Spinner label="Getting your cards..." color="primary" />
    }

    /** this is for either an Action Confirmation (marking card as paid) or a Delete Confirmation */
    const handleCardAction = ({ card, type }: CardActionProps ) => {
        const message = type === CONFIRMATION_TYPES.ACTION ? 
            `Are you sure that you want to mark ${card.name} as paid? This action cannot be undone.`
                : `Are you sure that you want to delete ${card.name}? This action cannot be undone.`
        
        
        setCardForPendingAction(card)

        dispatch(openConfirmationModal({ message, type }))
    }

    const handleMarkAsPaidConfirmation = async() => {
        if (!userUid || cardForPendingAction === null) {
            return false
        }

        const { id, billingMonth, billingDay } = cardForPendingAction
        
        const { success, error, errorCode } = await markCardAsPaid(userUid, id, billingMonth, billingDay)
        
        if (success) {
            dispatch(setNotificationMessage(`${cardForPendingAction.name} successfully marked as paid.`))
            dispatch(openNotification())

            setTimeout(() => location.reload(), 2000)
        } else {
            dispatch(setErrorDetails({
                message: error,
                code: errorCode
            }))
            dispatch(openErrorModal())
        }
        
        dispatch(closeConfirmationModal())
        setCardForPendingAction(null)
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
                <CardItem key={card.id} card={card} onAction={handleCardAction} />
            ))}
            </div>
        </div>
    )
}

