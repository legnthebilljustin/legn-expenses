export type ResponseType = {
    success: boolean
    message: string
}

export const PAYMENT_METHODS_ENUMS = {
    CARD: "Card",
    CASH: "Cash"
} as const