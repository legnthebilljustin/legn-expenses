export function convertToCurrency(amount: number) {
    if (typeof amount === "number") {
        return amount.toLocaleString('en-US', { minimumFractionDigits: 2 });
    }
}