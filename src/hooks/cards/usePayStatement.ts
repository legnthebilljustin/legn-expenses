import { markCardStatementAsPaidApi } from "@/apis/cards"
import { closeConfirmationModal, CONFIRMATION_TYPES, openConfirmationModal } from "@/state/confirmationSlice"
import { openErrorModal, setErrorDetails } from "@/state/errorSlice"
import { openNotification, setNotificationMessage } from "@/state/notificationSlice"
import { RootState } from "@/state/store"
import { CustomError } from "@/utils/customError"
import { useCallback, useState } from "react"
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

    const handleOnPayCardStatement = useCallback(({ statementUid, cardName, cardUid }: PayStatementProps) => {
        setDetailsForPayment({ statementUid, cardName, cardUid })
        const message = `Mark latest statement for ${cardName} as paid? This action cannot be reversed.`

        dispatch(openConfirmationModal({ message, type: CONFIRMATION_TYPES.ACTION }))
    }, [dispatch])

    const payCardStatement = async() => {
        dispatch(closeConfirmationModal())
        try {
            if (!detailsForPayment?.cardUid || !detailsForPayment?.statementUid || !uid) {
                throw new CustomError("Card ID or Statement ID is missing. Cannot process request.", 400)
            }

            await markCardStatementAsPaidApi(uid, detailsForPayment.cardUid, detailsForPayment.statementUid)

            dispatch(setNotificationMessage(`${detailsForPayment.cardName} successfully marked as paid.`))
            dispatch(openNotification())
            setDetailsForPayment(undefined)

            // TODO: make this DOM replace instead of page refresh
            setTimeout(() => location.reload(), 2000)
        } catch (error: any) {
            dispatch(setErrorDetails({
                message: error?.message || "Unknown error occured. Unable to mark statement as paid",
                code: error?.code || 500
            }))
            dispatch(openErrorModal())
        } finally {
            setIsDoingPayment(false)
        }
    }

    return {
        isDoingPayment,
        handleOnPayCardStatement,
        payCardStatement
    }
}