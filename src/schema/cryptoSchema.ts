import { z } from "zod";

export const CryptoSchema = z.object({
    name: z.string(),
    code: z.string(),
    isActive: z.boolean()
})

export type FirestoreCryptoSchema = z.infer<typeof CryptoSchema>