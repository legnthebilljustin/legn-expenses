export function convertToCurrency(amount: number) {
    if (typeof amount === "number") {
        return `Php ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    }
}