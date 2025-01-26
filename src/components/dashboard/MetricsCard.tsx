import { PESO_SYMBOL } from "@/constants/others"
import { convertToCurrency } from "@/utils/currency"
import { Card, CardBody } from "@nextui-org/react"

type Props = {
    amount: number
    transactions: number
    title: string
}

export default function MetricsCard({ amount, transactions, title }: Props) {
    return (
        <Card className="dark max-w-[250px] flex-0 h-auto">
            <CardBody className="text-center">
                <div className="text-sm text-teal-400 mb-2 font-bold">
                    { title }
                </div>
                <p className="text-2xl font-thin">{ convertToCurrency(amount, PESO_SYMBOL) }</p>
                <div className="text-sm text-gray-300 mb-2">
                    <span className="font-light">{transactions}</span> transactions
                </div>
            </CardBody>
        </Card>
    )
}