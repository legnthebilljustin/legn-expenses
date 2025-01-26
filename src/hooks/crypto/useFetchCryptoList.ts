import { fetchCryptoPricesAPI } from "@/apis/proxy"
import { getAllCrypto } from "@/apis/crypto"
import { CryptoSchema } from "@/schema/cryptoSchema"
import { setCryptoList } from "@/state/cryptoSlice"
import { openErrorModal, setErrorDetails } from "@/state/errorSlice"
import { CryptoListType, CryptoWithPriceType } from "@/types/crypto"
import { QueryDocumentSnapshot } from "firebase/firestore/lite"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

export const useFetchCryptoList = () => {
    const [isLoading, setIsLoading] = useState(true)
    const dispatch = useDispatch()

    useEffect(() => {
        let isMounted = true
        const runOnMount = async() => {
            const cryptoList = await fetchCryptoList()
                
            if (cryptoList && cryptoList.length > 0) {
                const withPriceList = await getCryptoPricesAndAttach(cryptoList)
                if (withPriceList) {
                    dispatch(setCryptoList(withPriceList))
                }
            }
    
            if (isMounted) {
                setIsLoading(false)
            }
        }

        runOnMount()

        return () => {
            isMounted = false
        }
    }, [])

    const fetchCryptoList = async(): Promise<CryptoListType[] | undefined> => {
        const { success, data, error, errorCode } = await getAllCrypto()

        if (!success) {
            dispatch(setErrorDetails({
                message: error || "Unknown error occured. Cannot get list.", 
                code: errorCode || 500
            }))
            dispatch(openErrorModal())
            return
        }

        const cryptoList: CryptoListType[] = data
            .map((doc: QueryDocumentSnapshot<CryptoListType>) => {
                const parseResult = CryptoSchema.safeParse(doc.data())
                if (parseResult.success) {
                    return { id: doc.id, ...parseResult.data }
                }
                return null
            })
            .filter((item: CryptoListType | null) => item !== null)

        return cryptoList
    }

    const getCryptoPricesAndAttach = async(cryptoList: CryptoListType[]): Promise<CryptoWithPriceType[] | undefined> => {
        if (!Array.isArray(cryptoList)) {
            throw new Error(JSON.stringify({ message: "Invalid parameter type given." , code: 400 }))
        }

        const cryptoCodes = cryptoList.map(item => item.code)

        try {
            const priceData = await fetchCryptoPricesAPI(cryptoCodes);

            if (!Array.isArray(priceData)) {
                throw new Error(JSON.stringify({ message: "Unable to process prices due to mismatched data structure." , code: 500 }))
            }
            
            const list: CryptoWithPriceType[] = cryptoList.map((crypto: CryptoListType) => {
                const quotePrice = priceData.find((item: any) => item?.symbol === crypto?.code)

                const price = quotePrice?.price || 0
                const percentChange = quotePrice?.percentChange || 0
    
                return { 
                    ...crypto, 
                    price: price,
                    percentChange24H: percentChange.toFixed(2)
                }
            })
    
            return list
            
        } catch (err: any) {
            const error = JSON.parse(err.message)

            dispatch(setErrorDetails({
                message: error?.message || "Unknown error occured. Cannot get list.", 
                code: error?.code || 500
            }))
            dispatch(openErrorModal())
        }
    }

    return {
        isLoading
    }
}