import { FirestoreCryptoHoldingSchema } from "@/schema/cryptoHoldingSchema";
import { FirestoreCryptoSchema } from "@/schema/cryptoSchema";

export type AssetTableItemType = FirestoreCryptoHoldingSchema & {
    id: string
    unrealizedPNL: UnrealizedPNLType
}

export type UnrealizedPNLType = {
    amount: number
    percentage: number
}

export type CryptoListType = FirestoreCryptoSchema & {
    id: string
}

export type CryptoWithPriceType = CryptoListType & {
    price: number
    percentChange24H: number
}