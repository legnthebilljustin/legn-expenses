import { Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { AssetTableItemType } from "@/types/crypto";
import { convertToCurrency } from "@/utils/currency";
import { DOLLAR_SYMBOL } from "@/constants/others";
import PNLIndicator from "./PNLIndicator";

type Props = {
    holdings: AssetTableItemType[]
}

type TableColumnType = {
    key: string
    label: string
    align: "start" | "end" | "center"
}

const columns: TableColumnType[] = [
    { key: "crypto", label: "Code/Name", align: "start" },
    { key: "quantity", label: "Quantity", align: "end" },
    { key: "entryPrice", label: "Entry Price", align: "end" },
    { key: "cost", label: "Cost", align: "end" },
    { key: "fee", label: "Fee", align: "end" },
    { key: "netCost", label: "Net Cost", align: "end" },
    { key: "unrealizedProfit&Loss", label: "UPNL", align: "end" }
]

export default function HoldingsTable({ holdings }: Props) {
    return (
        <Table aria-label="holdings-table">
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key} 
                        align={column.align}
                        className="uppercase"
                    >{ column.label }</TableColumn>}
            </TableHeader>
            <TableBody>
                {holdings.map((asset: AssetTableItemType) => (
                    <TableRow key={asset.id}>
                        <TableCell>
                            <Chip size="sm" variant="flat" radius="sm" className="mr-2">{ asset.code || "-" }</Chip>
                            { asset.name || "-" }
                        </TableCell>
                        <TableCell>{ asset.quantity || "-" } { asset.code }</TableCell>
                        <TableCell>{ convertToCurrency(asset.entryPrice, DOLLAR_SYMBOL) || "-" }</TableCell>
                        <TableCell>{ convertToCurrency(asset.cost, DOLLAR_SYMBOL) || "-" }</TableCell>
                        <TableCell>{ asset.fee || "-" }</TableCell>
                        <TableCell>{ convertToCurrency(asset.netCost, DOLLAR_SYMBOL) || "-" }</TableCell>
                        <TableCell>
                            <PNLIndicator amount={asset.unrealizedPNL.amount} percentage={asset.unrealizedPNL.percentage} 
                                showAmount={false}
                            />
                        </TableCell>
                    </TableRow>
                    ))}
            </TableBody>
        </Table>
    )
}