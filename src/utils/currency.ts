export function convertToCurrency(amount: number):string {
    if (typeof amount !== "number") {
        return "??"
    }

    return `Php ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}