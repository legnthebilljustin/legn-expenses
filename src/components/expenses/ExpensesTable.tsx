import { ExpensesItemType } from "@/types/expenses"
import { convertToCurrency } from "@/utils/currency"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import PaymentTypeChip from "../shared/PaymentTypeChip"
import { PESO_SYMBOL } from "@/constants/others"

const columns = [
    { key: "item", label: "item" },
    { key: "paymentMethod", label: "payment method" },
    { key: "amount", label: "amount" }
]

type Props = {
    expenses: ExpensesItemType[]
}

export default function ExpensesTable({ expenses }: Props) {
    return <Table aria-label="expenses-table">
        <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key} 
                    align={column.key === "amount" ? "end" : "start"}
                    className="uppercase"
                >{ column.label }</TableColumn>}
        </TableHeader>
        <TableBody>
            {expenses.map((item: ExpensesItemType) => (
                <TableRow key={item.id}>
                    <TableCell>{ item.itemName }</TableCell>
                    <TableCell width="20%">
                        <PaymentTypeChip paymentType={item.paymentMethod} 
                            card={item.card} 
                        />
                    </TableCell>
                    <TableCell width="20%">{ convertToCurrency(item.price, PESO_SYMBOL) }</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}