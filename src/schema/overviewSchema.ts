import { z } from "zod";

export const OverviewSchema = z.object({
    amount: z.number(),
    month: z.number().int().min(1).max(12),
    transactions: z.number(),
    year: z.number()
})

export type FirestoreOverview = z.infer<typeof OverviewSchema>