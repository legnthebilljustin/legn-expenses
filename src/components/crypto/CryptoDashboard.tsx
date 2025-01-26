import { useFetchCryptoList } from "@/hooks";
import PriceCard from "./PriceCard";
import { Spinner } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { CryptoWithPriceType } from "@/types/crypto";

export default function CryptoDashboard() {
    const { cryptoList } = useSelector((state: RootState) => state.crypto)
    const { isLoading } = useFetchCryptoList()
    

    if (isLoading) {
        return <Spinner label="Fetching list of supported cryptocurrencies..." />
    }
    
    if (!isLoading && !cryptoList || cryptoList.length === 0) {
        return <div className="text-center mt-4 text-red-400">No available cryptocurrency for this service.</div>
    }

    return (
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {cryptoList.map((item: CryptoWithPriceType, index: number) => (
                <PriceCard key={index} code={item.code} name={item.name} price={item.price} percentChange24H={item.percentChange24H} />
            ))}
        </div>
    )
}