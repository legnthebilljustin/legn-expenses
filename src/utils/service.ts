import { COLLECTIONS } from "@/firebase/collections"

export const getUserSubCollectionPath = (userUid: string, subPath: string): string => {
    return `${COLLECTIONS.USERS}/${userUid}/${subPath}`
}