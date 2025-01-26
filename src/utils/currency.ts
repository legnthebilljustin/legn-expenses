import { PESO_SYMBOL } from "@/constants/others";

export function convertToCurrency(amount: number, symbol: string | undefined):string {
    if (typeof amount !== "number") {
        return "??"
    }

    return `${symbol || PESO_SYMBOL } ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}