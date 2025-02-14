import { Card, CardBody } from "@nextui-org/react"
import { ExpensesItemType } from "@/types/expenses"
import { convertToCurrency } from "@/utils/currency"
import { PESO_SYMBOL } from "@/constants/others"

type Props = {
    item: ExpensesItemType
}

export default function ExpensesItem({ item }: Props) {
    return (
        <Card radius="none" shadow="sm">
            <CardBody className="py-2 px-6">
                <div className="flex flex-wrap">
                    <div className="w-2/3">
                        <div>
                            <div className="text-md capitalize">{ item.itemName }</div>
                            <div className="text-sm text-default-500">{ item.purchaseDate }</div>
                        </div>
                    </div>
                    <div className="w-1/3 text-right">
                        - P{convertToCurrency(item.price, PESO_SYMBOL)}
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}