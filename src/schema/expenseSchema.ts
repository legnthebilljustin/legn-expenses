import { PAYMENT_METHODS_ENUMS } from "@/constants/others"
import { zodValidateDateOrTimestamp } from "@/utils/service"
import * as z from "zod"

export const ExpenseSchema = z.object({
    card: z.union([
        z.null(),
        z.object({
            color: z.string(),
            name: z.string()
        })
    ]),
    cardId: z.string(),
    itemName: z.string(),
    paymentMethod: z.enum([PAYMENT_METHODS_ENUMS.CARD, PAYMENT_METHODS_ENUMS.CASH]),
    price: z.number(),
    purchaseDate: zodValidateDateOrTimestamp()
})

export type FirestoreExpense = z.infer<typeof ExpenseSchema>