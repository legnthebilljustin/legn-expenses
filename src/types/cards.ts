import { CARD_STATEMENT_PAYMENT_STATUS, CARDS_FETCH_TYPE } from "@/constants/others"
export type CardForDropdownType = {
    id: string
    name: string
    color: string
}

export type CardWithStatementType = {
    id: string
    name: string
    color: string
    billingDay: string
    statement: {
        id: string
        billingDate: string
        dueDate: string
        status: CardPaymentStatus
    }
}

export type CardFormInputType = {
    name: string
    billingDay: number | null
    dueDaysAfterBilling: number | null
    color: string
}

export type CardPayment = {
    billingDate: string
    amountPaid: number
    createdAt: string
}

export type CardPaymentStatus = typeof CARD_STATEMENT_PAYMENT_STATUS[keyof typeof CARD_STATEMENT_PAYMENT_STATUS]
export type CardsFetchType = typeof CARDS_FETCH_TYPE[keyof typeof CARDS_FETCH_TYPE]