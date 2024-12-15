export type CardDetailsType = {
    id?: string
    name: string
    billingDay: number
    dueDate?: string
    color: string
}

export type CardFormInputType = {
    name: string
    billingDay: number | null
    dueDaysAfterBilling: number | null
    color: string
}