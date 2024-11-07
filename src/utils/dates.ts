export type DueDatesType = {
    billingDate: string
    paymentDueDate: string
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

    /**
     * determine last month's billing and payment due dates by default
     * since it will be used to compare today's date to determine
     * which billing and payment cycle should be returned
     */
    let billingDate = generateBillingDate(currentMonth - 1)
    let paymentDueDate = new Date(billingDate)
    paymentDueDate.setDate(billingDate.getDate() + dueDaysAfterBilling)

    // check if today's date exceeds last payment due date
    if (today > paymentDueDate) {
        billingDate = generateBillingDate(currentMonth)

        paymentDueDate = new Date(billingDate)
        paymentDueDate.setDate(billingDate.getDate() + dueDaysAfterBilling)
    }
    
    return { 
        billingDate: billingDate.toDateString(), 
        paymentDueDate: paymentDueDate.toDateString() 
    }
}