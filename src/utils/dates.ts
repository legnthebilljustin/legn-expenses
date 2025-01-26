import { CalendarDate } from "@nextui-org/react"
import { isANumber } from "./misc"

export type DueDatesType = {
    billingDate?: Date
    paymentDueDate: string
    billingMonth: number
    billingDay: number
}

export const formatMonthYear = (month: number, year: number): string => {
    if (isANumber(month) && isANumber(year)) {
        const date = new Date(year, month - 1)

        return date.toLocaleString("en-US", { month: "long", year: "numeric" })
    }

    return "Unreadable date."
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

export const generateFullDate = (year: number, month: number, day: number): Date => {
    return new Date(year, month, day)
}