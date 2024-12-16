export type CardDetailsType = {
    id?: string
    name: string
    billingDay: number
    dueDate?: string
    color: string
    isPaid?: boolean
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