import { PageHeading } from "@/components"
import { useMetricsExpenses } from "@/hooks"
import { RootState } from "@/state/store"
import { convertToCurrency } from "@/utils/currency"
import { Card, CardBody, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"

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
                    <Card className="dark max-w-[250px] flex-0 h-auto">
                        <CardBody className="text-center">
                            <div className="text-sm text-teal-400 mb-2 font-medium">
                                Month to Date
                            </div>
                            <p className="text-2xl font-thin">{ convertToCurrency(expensesMetrics.amount) }</p>
                            <div className="text-sm text-gray-300 mb-2">
                                <span className="font-light">{expensesMetrics.transactions}</span> transactions
                            </div>
                            
                        </CardBody>
                    </Card>
                    <Card className="dark max-w-[250px] flex-0 h-auto">
                        <CardBody className="text-center">
                            <div className="text-sm text-indigo-400 mb-2 font-medium">
                                Overall Total
                            </div>
                            <p className="text-2xl font-thin">Php 127,002.28</p>
                            <div className="text-sm text-gray-300 mb-2">
                                <span className="font-light">128</span> transactions
                            </div>
                        </CardBody>
                    </Card>
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