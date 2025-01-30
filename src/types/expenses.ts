export type ExpensesItemType = {
    id: string
    price: number
    itemName: string
    purchaseDate: string
    paymentMethod: string
    cardId: string
    card: ExpensesCardInfoType
}

export type ExpensesFormInputGroupType = {
    price: number
    itemName: string
    paymentMethod: string
    cardId: string
    purchaseDate: Date | null
    card: ExpensesCardInfoType | null
}

export type GroupedExpensesType = {
    purchaseDate: string
    expenses: ExpensesItemType[]
}

export type ExpensesCardInfoType = {
    name: string | undefined
    color: string | undefined
}

export type EditExpensesDetailsType = {
    id: string
    itemName: string
    price: number
}

export type ExpensesMetrics = {
    amount: number,
    transactions: number
}