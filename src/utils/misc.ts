export const capitalizeString = (str: string): string => {
    if (typeof str === "string") {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    return str
}

export const isANumber = (val: any): boolean => {
    return typeof val === "number"
}

export const isAValidString = (val: any): boolean => {
    return typeof val === "string"
}

export const isPositiveNumber = (val: number): boolean => {
    if (typeof val !== "number") {
        return false
    }

    return val >= 0
}