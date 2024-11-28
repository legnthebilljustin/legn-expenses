export type ExpensesItemType = {
    id: string
    price: number
    itemName: string
    purchaseDate: string
}

export type ExpensesFormInputGroupType = {
    price: number
    itemName: string
    purchaseDate: Date | null
    paymentMethod: string
    cardId: string
}
