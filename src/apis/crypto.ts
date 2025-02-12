import { BASE_PATH, COLLECTIONS } from "@/firebase/collections"
import db from "@/firebase/config"
import { CryptoAssetFormData } from "@/schema/cryptoHoldingSchema"
import { CustomError } from "@/utils/customError"
import { addDoc, collection, getDocs, limit, orderBy, query, QueryDocumentSnapshot } from "firebase/firestore/lite"

export const getAllCrypto = async(): Promise<QueryDocumentSnapshot[]> => {
    try {
        const result = await getDocs(
            query(
                collection(db, `${COLLECTIONS.CRYPTO}`)
            )
        )
        return result.docs
    } catch (error: any) {
        throw new CustomError(
            error?.message || "Unable to get available list of cryptocurrency.",
            error?.code
        )
    }
}

export const postCryptoAsset = async(userUid: string, assetFormData: CryptoAssetFormData): Promise<any> => {
    try {
        const path = `${BASE_PATH + userUid}/${COLLECTIONS.CRYPTO_HOLDINGS}`
        // TODO: get new doc here and add to DOM
        return await addDoc(
            collection(db, path),
            assetFormData
        )
    } catch (error: any) {
        throw new CustomError(
            error?.message || "Unable to get create new crypto asset/holding.",
            error?.code
        )
    }
}

export const getHoldings = async(userUid: string): Promise<QueryDocumentSnapshot[]> => {
    try {
        const querySnapshot = await getDocs(
            query(
                collection(db, `${BASE_PATH + userUid}/${COLLECTIONS.CRYPTO_HOLDINGS}`),
                orderBy("purchaseDate", "desc"),
                limit(30)
            )
        )

        return querySnapshot.docs
    } catch (error: any) {
        throw new CustomError(
            error?.message || "Unable to get list of crypto holdings.",
            error?.code
        )
    }
}