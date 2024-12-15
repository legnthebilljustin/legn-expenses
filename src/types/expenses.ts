export type ExpensesItemType = {
    id: string
    price: number
    itemName: string
    purchaseDate: string
    paymentMethod: string
    cardId: string
}

export type ExpensesFormInputGroupType = {
    price: number
    itemName: string
    paymentMethod: string
    cardId: string
    purchaseDate: Date | null
}

export type GroupedExpensesType = {
    purchaseDate: string
    expenses: ExpensesItemType[]
}