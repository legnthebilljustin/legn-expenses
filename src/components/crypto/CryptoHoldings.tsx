import HoldingsTable from "./HoldingsTable";
import AddAssetForm from "./AddAssetForm";
import { useFetchHoldings } from "@/hooks/crypto/useFetchHoldings";
import { Spinner } from "@nextui-org/react";


export default function CryptoHoldings() {
    const {
        isFetching,
        holdingsList
    } = useFetchHoldings()

    if (isFetching) {
        return <Spinner label="Getting your crypto holdings..." />
    }

    return (
        <>
            <div className="w-full text-right mb-4">
                <AddAssetForm />
            </div>
            <HoldingsTable holdings={holdingsList}/>
        </>
    )
}