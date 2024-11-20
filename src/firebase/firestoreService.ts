import { FirestoreError } from "firebase/firestore/lite"

export interface FirestoreResponse<T = any> {
    success: boolean
    data?: T
    error?: string
    errorCode?: number
    message?: string
}

export const firestoreHandler = async <T>(callback: () => Promise<T>): Promise<FirestoreResponse<T>> => {
    try {
        const data = await callback();
        return { success: true, data };
    } catch (error) {
        if ((error as FirestoreError).code) {
            const firestoreError = error as FirestoreError;
        
            return {
                success: false,
                error: firestoreError.message || "Unkown error occured.",
                errorCode: parseInt(firestoreError.code)
            };
        }

        return {
            success: false,
            error: "Unkown error occured.",
            errorCode: 400
        };
        
    }
}