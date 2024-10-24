export const getDateMinusDays = (days: number): Date | false => {
    if (typeof days === "number") {
        const date = new Date()
        date.setDate(date.getDate() - days);
        return date
    }

    return false
}