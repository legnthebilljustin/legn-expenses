import { PAYMENT_METHODS_ENUMS } from "@/constants/others"
import { Chip } from "@nextui-org/react"

export type PaymentType = typeof PAYMENT_METHODS_ENUMS[keyof typeof PAYMENT_METHODS_ENUMS]

type Props = {
    paymentType: PaymentType | string
}

export default function PaymentTypeChip({ paymentType }: Props) {
    return paymentType === PAYMENT_METHODS_ENUMS.CARD ?
        <Chip color="primary" size="sm" radius="sm" className="font-bold">Cash</Chip>
        : <Chip className="text-white-500" size="sm" radius="sm">Card</Chip>
    // NOTE: Will be switching "Card" chip with the card name
}