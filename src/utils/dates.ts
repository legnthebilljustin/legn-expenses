import { CalendarDate } from "@nextui-org/react"

export type DueDatesType = {
    billingDate?                                                                                                                                       : Date
    paymentDueDate: string
    billingMonth: number
    billingDay: number
}

export const isACalendarDate = (value: CalendarDate) => {
    return (
        typeof value === "object" && value !== null &&
        typeof value.day === "number" &&
        typeof value.month === "number" &&
        typeof value.year === "number" &&
        typeof value.era === "string"
    )
}

export const getDateMinusDays = (days: number): Date | false => {
    if (typeof days === "number") {
        const date = new Date()
        date.setDate(date.getDate() - days);
        return date
    }

    return false
}

export const getBillingAndDueDate = (
    billingDay: number, 
    dueDaysAfterBilling: number
): DueDatesType => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const generateBillingDate = (month: number): Date => new Date(currentYear, month, billingDay)
    let dueDate = "-"
    let billingMonth = currentMonth - 1
    /**
     * determine last month's billing and payment due dates by default
     * since it will be used to compare today's date to determine
     * which billing and payment cycle should be returned
     */
    const currentBillingDate = generateBillingDate(currentMonth)
    // let lastBillingDate = generateBillingDate(currentMonth - 1)
    // let lastPaymentDueDate = new Date(lastBillingDate)
    // lastPaymentDueDate.setDate(lastBillingDate.getDate() + dueDaysAfterBilling)
    // lastPaymentDueDate.setHours(23, 59, 59, 999)
    
    if (today > currentBillingDate) {
        const currentDueDate = new Date(currentBillingDate)
        currentDueDate.setDate(currentBillingDate.getDate() + dueDaysAfterBilling)

        dueDate = currentDueDate.toDateString()
        billingMonth = currentBillingDate.getMonth() + 1
    }

    return { 
        paymentDueDate: dueDate,
        billingDay: billingDay,
        billingMonth: billingMonth
    }
}