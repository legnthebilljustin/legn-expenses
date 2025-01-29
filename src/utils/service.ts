import * as z from "zod"
import { COLLECTIONS } from "@/firebase/collections"
import { Timestamp } from "firebase/firestore/lite"


export const getUserSubCollectionPath = (userUid: string, subPath: string): string => {
    return `${COLLECTIONS.USERS}/${userUid}/${subPath}`
}

export const zodValidateDateOrTimestamp = () => {
    return z.custom((value) => {
        return value instanceof Date || value instanceof Timestamp
    }, { message: "Invalid date format. Must be a Date or Firestore Timestamp" })
}

export const validateSchemaObject = <T>(schema: z.ZodSchema, data: unknown): T => {
    const parsedResult = schema.safeParse(data)

    if (!parsedResult.success) {
        throw new Error("Validation failed due to schema mismatch.")
    }

    return parsedResult.data
} 

export const validateSchemaDataArray = (schema: z.ZodSchema, data: any[]): boolean => {
    if (!Array.isArray(data)) {
        return false
    }

    const arraySchema = z.array(schema)
    const validation = arraySchema.safeParse(data)

    return validation.success
}