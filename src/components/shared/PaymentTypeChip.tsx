import { PAYMENT_METHODS_ENUMS } from "@/constants/others"
import { ExpensesCardInfoType } from "@/types/expenses"
import { Chip } from "@nextui-org/react"

export type PaymentType = typeof PAYMENT_METHODS_ENUMS[keyof typeof PAYMENT_METHODS_ENUMS]

type Props = {
    paymentType: PaymentType | string
    card: ExpensesCardInfoType
}

export default function PaymentTypeChip({ paymentType, card }: Props) {

    if (paymentType === PAYMENT_METHODS_ENUMS.CASH) {
        return <Chip className="text-white-500" size="sm" radius="sm">Cash</Chip>
    }

    return <Chip size="sm" radius="sm"
                className="text-white-500"
                style={{ backgroundColor: card.color || "transparent", maxWidth: 200 }}
            >
                <span className="truncate">{ card.name || "Card" }</span>
            </Chip>
}