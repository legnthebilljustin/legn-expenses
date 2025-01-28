import { EditExpensesDetailsType, ExpensesItemType } from "@/types/expenses"
import { convertToCurrency } from "@/utils/currency"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import PaymentTypeChip from "../shared/PaymentTypeChip"
import { PESO_SYMBOL } from "@/constants/others"

const columns = [
    { key: "item", label: "item" },
    { key: "paymentMethod", label: "payment method" },
    { key: "amount", label: "amount" },
    { key: "action", label: "" }
]

type Props = {
    expenses: ExpensesItemType[]
    onEditExpenseItem: (data: EditExpensesDetailsType) => void
}

export default function ExpensesTable({ expenses, onEditExpenseItem }: Props) {
    return <Table aria-label="expenses-table">
        <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key} 
                    align={["amount", "action"].includes(column.key) ? "end" : "start"}
                    className="uppercase"
                >{ column.label }</TableColumn>}
        </TableHeader>
        <TableBody>
            {expenses.map((item: ExpensesItemType) => (
                <TableRow key={item.id}>
                    <TableCell width="50%">{ item.itemName }</TableCell>
                    <TableCell>
                        <PaymentTypeChip paymentType={item.paymentMethod} 
                            card={item.card} 
                        />
                    </TableCell>
                    <TableCell width="20%">{ convertToCurrency(item.price, PESO_SYMBOL) }</TableCell>
                    <TableCell width="10%">
                        <i className='bx bxs-edit text-orange-400 mr-2 cursor-pointer'
                            onClick={() => onEditExpenseItem({
                                id: item.id,
                                itemName: item.itemName,
                                price: item.price
                            })}
                        ></i>
                        {/* <i className='bx bxs-trash text-red-400 cursor-pointer'></i> */}
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}