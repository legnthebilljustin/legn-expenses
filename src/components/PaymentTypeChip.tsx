import { PAYMENT_METHODS_ENUMS } from "@/constants/others"
import { ExpensesCardInfoType } from "@/types/expenses"
import { Chip } from "@nextui-org/react"

export type PaymentType = typeof PAYMENT_METHODS_ENUMS[keyof typeof PAYMENT_METHODS_ENUMS]

type Props = {
    card: ExpensesCardInfoType | null
}

export default function PaymentTypeChip({ card }: Props) {
    return <Chip size="sm" radius="sm"
                className="text-white-500 truncate"
                style={{ 
                    color: card?.color || "white",
                    width: 120,
                    backgroundColor: "#262626"
                }}
            > 
                <div className="w-[120px] truncate">
                    { card?.name || "Cash" }
                </div>
            </Chip>
}