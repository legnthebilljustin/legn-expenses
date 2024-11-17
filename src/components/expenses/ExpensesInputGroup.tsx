import { Input } from "@nextui-org/react";
import { ExpensesFormInputGroupType } from "../../types/expenses";

type Props = {
    index: number
    item: ExpensesFormInputGroupType
    onChange: Function
}

export default function ExpensesInputGroup({ index, item, onChange }: Props) {

    return (
        <div className="flex my-3">
            <Input type="number" label="Price" size="sm"
                className="max-w-[100px] mr-2"
                name="price"
                placeholder="0"
                value={item.price.toString()}
                onChange={(event) => onChange(event, index)}
                isRequired
            />
            <Input type="text" label="Item Name" size="sm"
                className="max-w-[400px]"
                name="itemName"
                value={item.itemName}
                placeholder="Item name..."
                onChange={(event) => onChange(event, index)}
                isRequired
            />
        </div>
    )
}