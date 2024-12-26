import { MetricsCard, PageHeading } from "@/components"
import { useMetricsExpenses } from "@/hooks"
import { RootState } from "@/state/store"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"

import { useSelector } from "react-redux"

export default function Dashboard() {
    const { uid } = useSelector((state: RootState) => state.auth)
    
    const {
        expensesMetrics,
        isLoading
    } = useMetricsExpenses(uid)

    if (isLoading) {
        return 
    }

    return (
        <div>
            <PageHeading heading="Dashboard" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start mt-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <MetricsCard title="Month to Date"
                        amount={expensesMetrics?.amount || 0}
                        transactions={expensesMetrics?.transactions || 0}
                    />
                    <MetricsCard title="Overall Total"
                        amount={127002.28}
                        transactions={128}
                    />
                </div>
                <div>
                    <Table aria-label="Unpaid cards">
                        <TableHeader>
                            <TableColumn key={1}>Credit Card</TableColumn>
                            <TableColumn key={2}>Due Date</TableColumn>
                        </TableHeader>
                        <TableBody>
                            <TableRow key={0}>
                                <TableCell>Unionbank Rewards Platinum Visa</TableCell>
                                <TableCell>Thu Dec 29 2024</TableCell>
                            </TableRow>
                            <TableRow key={1}>
                                <TableCell>RCBC Classic</TableCell>
                                <TableCell>Wed Dec 28 2024</TableCell>
                            </TableRow>
                            <TableRow key={2}>
                                <TableCell>RCBC Classic</TableCell>
                                <TableCell>Wed Dec 28 2024</TableCell>
                            </TableRow>
                            <TableRow key={3}>
                                <TableCell>RCBC Classic</TableCell>
                                <TableCell>Wed Dec 28 2024</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}