import { GroupedExpensesType } from "@/types/expenses"
import ExpensesTable from "./ExpensesTable"

type Props = {
    groupedExpenses: GroupedExpensesType[]
}

export default function ExpensesList({ groupedExpenses }: Props) {
    if (!groupedExpenses.length) {
        return "No grouped expenses provided."
    }
    console.log(groupedExpenses)
    return (
        <div>
            {groupedExpenses.map((group: GroupedExpensesType, index: number) => (
            <div key={index}>
                <div className="date text-xs font-bold mb-2 mt-4 uppercase text-gray-400">{ group.purchaseDate }</div>
                <ExpensesTable expenses={group.expenses} />
            </div>
        ))}
        </div>
        
        
    )
}