import { EditExpensesDetailsType, ExpensesItemType } from "@/types/expenses"
import { convertToCurrency } from "@/utils/currency"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { PESO_SYMBOL } from "@/constants/others"
import { PaymentTypeChip } from "@/components"

const columns = [
    { key: "item", label: "item" },
    { key: "paymentMethod", label: "payment method" },
    { key: "amount", label: "amount" },
    { key: "action", label: "" }
]

type Props = {
    expenses: ExpensesItemType[]
    onEditExpenseItem: (data: EditExpensesDetailsType) => void
    onDeleteItem: (expenseUid: string) => void
}

export default function ExpensesTable({ expenses, onEditExpenseItem, onDeleteItem }: Props) {
    return <Table aria-label="expenses-table">
        <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key} 
                    align={["amount", "action"].includes(column.key) ? "end" : "start"}
                    className="uppercase"
                >{ column.label }</TableColumn>}
        </TableHeader>
        <TableBody>
            {/* NOTE: Unable to memoize table row component
                NextUI TableBody only accepts TableRow as child
                https://stackoverflow.com/questions/79042885/nextui-table-with-custom-component-inside-table-body 
            */}
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
                        <i className='bx bxs-trash text-red-400 cursor-pointer'
                            onClick={() => onDeleteItem(item.id)}
                        ></i>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}