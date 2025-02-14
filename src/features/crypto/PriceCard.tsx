import { Card, CardBody } from "@nextui-org/react";
import { convertToCurrency } from "@/utils/currency";
import { DOLLAR_SYMBOL } from "@/constants/others";
import PNLIndicator from "./PNLIndicator";
import { CryptoCodeChip } from "@/components";

type Props = {
    code: string
    name: string
    price: number
    percentChange24H: number
}

export default function PriceCard({ code, name, price, percentChange24H }: Props) {
    return <Card className="dark max-w-[250px]" shadow="sm" radius="sm">
        <CardBody>
            <div className="flex justify-between align-center">
                <CryptoCodeChip code={ code }/>
                <div className="price text-sm font-medium">
                    { convertToCurrency(price, DOLLAR_SYMBOL) }
                </div>
            </div>
            <div className="flex justify-between align-center text-xs mt-2">
                <div className="text-xs text-gray-400">{ name }</div>
                
                <PNLIndicator amount={0} percentage={percentChange24H} showAmount={false} />
               
            </div>
        </CardBody>
    </Card>
}