
import { getHoldings } from "@/apis/crypto"
import { CryptoHoldingSchema } from "@/schema/cryptoHoldingSchema"
import { openErrorModal, setErrorDetails } from "@/state/errorSlice"
import { RootState } from "@/state/store"
import { AssetTableItemType, CryptoWithPriceType, UnrealizedPNLType } from "@/types/crypto"
import { QueryDocumentSnapshot } from "firebase/firestore/lite"
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export const useFetchHoldings = () => {
    const { uid } = useSelector((state: RootState) => state.auth)
    const { cryptoList } = useSelector((state: RootState) => state.crypto)
    const [isFetching, setIsFetching] = useState<boolean>(true)
    const [holdingsList, setHoldingsList] = useState<any[]>([])

    const dispatch = useDispatch()

    const fetchHoldings = useCallback(
        async (userUid: string) => {
            const findCryptoData = (code: string): CryptoWithPriceType | undefined => {
                return cryptoList.find(item => item.code === code)
            }

            const calculateUnrealizedPNL = (cryptoPrice: number, quantity: number, cost: number): UnrealizedPNLType => {
                const currentCost = cryptoPrice * quantity
                const percentage = ((currentCost - cost) / cost) * 100

                return { 
                    amount: Math.round(currentCost * 100) / 100, 
                    percentage: Math.round(percentage * 100) / 100
                }
            }

            try {
                const { success, data, error, errorCode } = await getHoldings(userUid);

                if (!success) {
                    throw new Error(JSON.stringify({ error, errorCode }));
                }

                const processedAssets = data.map((doc: QueryDocumentSnapshot) => {
                    const parsedData = CryptoHoldingSchema.safeParse(doc.data());
                    if (!parsedData.success) {
                        // TODO: error logger here 
                        return null; 
                    }

                    const asset: AssetTableItemType = {
                        id: doc.id,
                        ...parsedData.data,
                        unrealizedPNL: {
                            amount: 0,
                            percentage: 0
                        },
                    };

                    const cryptoData = findCryptoData(asset.code)

                    if (cryptoData !== undefined) {
                        const upnl = calculateUnrealizedPNL(cryptoData?.price || 0, asset.quantity, asset.cost)
                        asset.unrealizedPNL = upnl
                    }

                    return asset;
                });

                setHoldingsList(processedAssets.filter(Boolean) as AssetTableItemType[]);

            } catch (err: any) {
                const { error, errorCode } = JSON.parse(err.message);
                dispatch(
                    setErrorDetails({
                        message: error || "An unexpected error occurred.",
                        code: errorCode || 500,
                    })
                );
                dispatch(openErrorModal());
            } finally {
                setIsFetching(false);
            }
        },
        [dispatch, cryptoList]
    );

    useEffect(() => {
        if (uid) {
            fetchHoldings(uid);
        }
    }, [uid, fetchHoldings]);

    return { isFetching, holdingsList };
}