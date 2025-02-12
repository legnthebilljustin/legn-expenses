import { markCardStatementAsPaidApi } from "@/apis/cards"
import { closeConfirmationModal, CONFIRMATION_TYPES, openConfirmationModal } from "@/state/confirmationSlice"
import { openErrorModal } from "@/state/errorSlice"
import { openNotification, setNotificationMessage } from "@/state/notificationSlice"
import { RootState } from "@/state/store"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export type PayStatementProps = {
    statementUid: string
    cardName: string
    cardUid: string
}

export const usePayStatement = () => {
    const { uid } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch()
    const [isDoingPayment, setIsDoingPayment] = useState(false)
    const [detailsForPayment, setDetailsForPayment] = useState<PayStatementProps | undefined>(undefined)

    const handleOnPayCardStatement = ({ statementUid, cardName, cardUid }: PayStatementProps) => {
        setDetailsForPayment({ statementUid, cardName, cardUid })
        const message = `Mark latest statement for ${cardName} as paid? This action cannot be reversed.`

        dispatch(openConfirmationModal({ message, type: CONFIRMATION_TYPES.ACTION }))
    }

    const payCardStatement = async() => {
        dispatch(closeConfirmationModal())
        if (!detailsForPayment?.cardUid || !detailsForPayment?.statementUid || !uid) {
            return false
        }

        setIsDoingPayment(true)
        const { success, error, errorCode } = await markCardStatementAsPaidApi(uid, detailsForPayment.cardUid, detailsForPayment.statementUid)

        if (success) {
            dispatch(setNotificationMessage(`${detailsForPayment.cardName} successfully marked as paid.`))
            dispatch(openNotification())
            setDetailsForPayment(undefined)

            setTimeout(() => location.reload(), 2000)
        } else {
            dispatch(openErrorModal({
                message: error || "Unknown error occured.",
                code: errorCode || 500
            }))
            
        }

        setIsDoingPayment(false)
    }

    return {
        isDoingPayment,
        handleOnPayCardStatement,
        payCardStatement
    }
}