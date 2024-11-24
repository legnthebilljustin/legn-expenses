import { FirestoreError } from "firebase/firestore/lite"

const FS_ERROR_CODES: Record<string, number> = {
    ABORTED: 409,
    ALREADY_EXISTS: 409,
    DEADLINE_EXCEEDED: 504,
    FAILED_PRECONDITION: 412,
    INTERNAL: 500,
    INVALID_ARGUMENT: 400,
    NOT_FOUND: 404,
    PERMISSION_DENIED: 403,
    RESOURCE_EXHAUSTED: 429,
    UNAUTHENTICATED: 401,
    UNAVAILABLE: 503,
};

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
                errorCode: getFirestoreErrorCode(firestoreError.code)
            };
        }

        return {
            success: false,
            error: "Unkown error occured.",
            errorCode: 503
        };
        
    }
}

const getFirestoreErrorCode = (errorKey: keyof typeof FS_ERROR_CODES): number => {
    return FS_ERROR_CODES[errorKey] || 500
}