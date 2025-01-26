import * as z from "zod"

export const CreditCardSchema = z.object({
    billingDay: z.number(),
    color: z.string(),
    dueDaysAfterBilling: z.number(),
    name: z.string()
})

export type FirestoreCreditCard = z.infer<typeof CreditCardSchema>