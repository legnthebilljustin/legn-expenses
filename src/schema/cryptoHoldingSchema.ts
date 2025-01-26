import { zodValidateDateOrTimestamp } from "@/utils/service";
import { z } from "zod";

export const CryptoHoldingSchema = z.object({
    purchaseDate: zodValidateDateOrTimestamp(),
    name: z.string(),
    code: z.string(),
    entryPrice: z.number(),
    quantity: z.number(),
    cost: z.number(),
    fee: z.number(),
    netCost: z.number(),
    isLiquidated: z.boolean()
})

/**
 * gives us granular control over schema requirements
 * modifies only specific properties while preserving the reset
 */

export const ModifiedCryptoHoldingSchema = CryptoHoldingSchema.extend({
    isLiquidated: z.boolean().optional(),
    purchaseDate: zodValidateDateOrTimestamp().nullable()
})

export type FirestoreCryptoHoldingSchema = z.infer<typeof CryptoHoldingSchema>
export type CryptoAssetFormData = z.infer<typeof ModifiedCryptoHoldingSchema>