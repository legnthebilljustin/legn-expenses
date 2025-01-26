import { BASE_PATH, COLLECTIONS } from "@/firebase/collections"
import db from "@/firebase/config"
import { firestoreHandler, FirestoreResponse } from "@/firebase/firestoreService"
import { CryptoAssetFormData } from "@/schema/cryptoHoldingSchema"
import { addDoc, collection, getDocs, limit, orderBy, query } from "firebase/firestore/lite"

export const getAllCrypto = async(): Promise<FirestoreResponse> => {
    return firestoreHandler(async() => {
        const result = await getDocs(
            query(
                collection(db, `${COLLECTIONS.CRYPTO}`)
            )
        )

        return result.docs
    })
}

export const postCryptoAsset = async(userUid: string, assetFormData: CryptoAssetFormData): Promise<FirestoreResponse> => {
    return firestoreHandler(async() => {
        const path = `${BASE_PATH + userUid}/${COLLECTIONS.CRYPTO_HOLDINGS}`
        return await addDoc(
            collection(db, path),
            assetFormData
        )
    })
}

export const getHoldings = async(userUid: string): Promise<FirestoreResponse> => {
    return firestoreHandler(async() => {
        const querySnapshot = await getDocs(
            query(
                collection(db, `${BASE_PATH + userUid}/${COLLECTIONS.CRYPTO_HOLDINGS}`),
                orderBy("purchaseDate", "desc"),
                limit(30)
            )
        )

        return querySnapshot.docs
    })
}