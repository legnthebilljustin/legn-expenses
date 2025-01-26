import { CARD_STATEMENT_PAYMENT_STATUS, CARD_STATEMENT_PAYMENT_STATUS_LABEL } from "@/constants/others"
import { CardPaymentStatus } from "@/types/cards"
import { isANumber } from "@/utils/misc"
import { Chip } from "@nextui-org/react"

type Props = {
    status: CardPaymentStatus
}

export default function PaymentStatus({ status }: Props) {
    if (!isANumber(status)) {
        return <Chip size="sm" isDisabled variant="flat">Invalid Type</Chip>
    }

    const color = status === CARD_STATEMENT_PAYMENT_STATUS.PAID ? "success"
                    : status === CARD_STATEMENT_PAYMENT_STATUS.OVERDUE ? "danger"
                        : "default"

    return (
        <Chip size="sm" variant="flat" color={color}>
            { CARD_STATEMENT_PAYMENT_STATUS_LABEL[status] }
        </Chip>
    )
}