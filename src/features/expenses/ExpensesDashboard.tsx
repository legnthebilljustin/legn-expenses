import { useGetExpensesMetrics } from "@/hooks"
import { Spinner, Table, TableBody, TableHeader, TableCell, TableColumn, TableRow } from "@nextui-org/react"
import { MonthlyExpensesListType } from "@/types/overviews"
import { convertToCurrency } from "@/utils/currency"
import { PESO_SYMBOL } from "@/constants/others"
import { MetricsCard } from "@/components"

export default function ExpensesDashboard() {
    const {
        isLoading,
        monthToDateExpenses,
        monthlyExpensesList,
        overAllExpensesData
    } = useGetExpensesMetrics()

    if (isLoading) {
        return <Spinner label="Preparing your data..." />
    }
    
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start mt-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center">
                <MetricsCard title="Month to Date"
                    amount={monthToDateExpenses?.amount || 0}
                    transactions={monthToDateExpenses?.transactions || 0}
                />
                <MetricsCard title="Overall Expenses"
                    amount={overAllExpensesData?.amount || 0}
                    transactions={overAllExpensesData?.transactions || 0}
                />
            </div>
            <div>
                <Table aria-label="Monthly Expenses">
                    <TableHeader>
                        <TableColumn key="date">Date</TableColumn>
                        <TableColumn key="transactions" className="text-right">Transactions</TableColumn>
                        <TableColumn key="amount" className="text-right">Amount</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {monthlyExpensesList.map((data: MonthlyExpensesListType, index: number) => (
                            <TableRow key={index}>
                                <TableCell>{ data.date }</TableCell>
                                <TableCell className="text-right">{ data.transactions }</TableCell>
                                <TableCell className="text-right">{ convertToCurrency(data?.amount || 0, PESO_SYMBOL) }</TableCell>
                            </TableRow>
                        ))}
                        
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}