export const PAYMENT_METHODS_ENUMS = {
    CARD: "Card",
    CASH: "Cash"
} as const

export const CARD_STATEMENT_PAYMENT_STATUS = {
    PENDING: 0,
    TO_RECEIVE: 1,
    PAID: 2,
    OVERDUE: 3
} as const

export const CARD_STATEMENT_PAYMENT_STATUS_LABEL = {
    [CARD_STATEMENT_PAYMENT_STATUS.PENDING]: "Pending",
    [CARD_STATEMENT_PAYMENT_STATUS.TO_RECEIVE]: "To Receive",
    [CARD_STATEMENT_PAYMENT_STATUS.PAID]: "Paid",
    [CARD_STATEMENT_PAYMENT_STATUS.OVERDUE]: "Overdue"
}

export const CARDS_FETCH_TYPE = {
    SELECT_DROPDOWN: "cardSelectDropdown",
    LIST: "cardsList"
} as const

export const DOLLAR_SYMBOL = "$"
export const PESO_SYMBOL = "₱"