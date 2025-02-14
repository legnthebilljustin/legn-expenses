import { Input, Select, SelectItem } from "@nextui-org/react";
import { ExpensesFormInputGroupType } from "@/types/expenses";
import { PAYMENT_METHODS_ENUMS } from "@/constants/others";
import { CardForDropdownType } from "@/types/cards";
import { ChangeEvent, useState } from "react";

type Props = {
    index: number
    item: ExpensesFormInputGroupType
    onChange: Function
    onCardSelectChange: Function
    creditCardsList: CardForDropdownType[]
    removeFormDataItem: Function
}

export default function ExpensesInputGroup({ index, item, onChange, creditCardsList, removeFormDataItem, onCardSelectChange }: Props) {
    const paymentMethods: Array<(typeof PAYMENT_METHODS_ENUMS)[keyof typeof PAYMENT_METHODS_ENUMS]> = [PAYMENT_METHODS_ENUMS.CARD, PAYMENT_METHODS_ENUMS.CASH]
    const [enableCardSelection, setEnableCardSelection] = useState(false)

    const handlePaymentMethodFieldChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target
        let enable = false
        if (value === PAYMENT_METHODS_ENUMS.CARD) {
            enable = true
        }
        onChange(event, index)
        /** doing it here instead to keep the logic contained in this component */
        setEnableCardSelection(enable)
    }

    return (
        <div className="flex my-3">
            <Input type="number" label="Price" size="sm"
                className="max-w-[100px] mr-2"
                name="price" id="price"
                placeholder="0"
                value={item.price.toString()}
                onChange={(event) => onChange(event, index)}
                isRequired
            />
            <Input type="text" label="Item Name" size="sm"
                className="max-w-[300px] mr-2"
                name="itemName" id="itemName"
                value={item.itemName}
                placeholder="Item name..."
                onChange={(event) => onChange(event, index)}
                isRequired
            />
            <Select label="Payment Method" placeholder="Select..." size="sm"
                className="max-w-[150px] mr-2" name="paymentMethod" id="paymentMethod"
                value={item.paymentMethod}
                onChange={(event) => handlePaymentMethodFieldChange(event)}
                isRequired
            >
                {paymentMethods.map((payment: string) => (
                    <SelectItem key={payment}>{ payment }</SelectItem>
                ))}
            </Select>
            <Select label="Select Card" size="sm"
                className="max-w-[150px]" name="cardId"
                placeholder="Select..." id="cardId"
                onChange={(event) => onCardSelectChange(event, index)}
                isDisabled={!enableCardSelection}
            >
                { (!creditCardsList.length) ? <SelectItem key={0} value="">No added cards yet.</SelectItem> :
                    creditCardsList.map((card: CardForDropdownType) => (
                        <SelectItem key={card.id as string} className="truncate">{ card.name }</SelectItem>
                    ))
                }
            </Select>
            <div className="ml-2 flex justify-center items-center">
                <i className="bx bxs-trash text-red-500 cursor-pointer" onClick={() => removeFormDataItem(index)} />
            </div>
        </div>
    )
}