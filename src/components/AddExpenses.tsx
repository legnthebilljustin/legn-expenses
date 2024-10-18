import { Button, CalendarDate, DatePicker } from "@nextui-org/react"
import ExpensesInputGroup from "./ExpensesInputGroup"
import { ChangeEvent, useCallback, useState } from "react"

type AddExpensesProps = {

}

export type ExpensesInputGroupType = {
    price: number | string
    itemName: string
}

export default function AddExpenses({ }: AddExpensesProps) {
    const [purchaseDate, setPurchaseDate] = useState<CalendarDate | null>(null)
    const [formData, setFormData] = useState<ExpensesInputGroupType[]>([
        { price: 0, itemName: "" }
    ])

    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = event.target
        console.log(name, value)
        console.log(formData[index])
        const updatedFormData = [...formData]

        updatedFormData[index] = {
            ...updatedFormData[index],
            [name]: value
        }

        setFormData(updatedFormData)
    }, [formData])

    const addFormDataItem = () => {
        const newExpensesItem: ExpensesInputGroupType = { price: 0, itemName: "" }
        setFormData(prevFormData => [...prevFormData, newExpensesItem])
    }

    const handleDateInputChange = (date: CalendarDate | null) => {
        setPurchaseDate(date)
    }

    const handleSubmit = () => {
        console.log(purchaseDate, formData)
    }

    return (
        <div>
            <DatePicker label="Purchase Date" size="sm"
                className="max-w-[300px] mb-8"
                isRequired name="purchaseDate"
                value={purchaseDate}
                onChange={handleDateInputChange}
            />
            {formData.map((item, index) => <ExpensesInputGroup key={index} item={item} index={index} onChange={handleInputChange} />)}

            <div className="mt-8 mb-4">
                <Button color="primary" size="sm" className="mr-2"
                    onClick={handleSubmit}
                >Save Item</Button>
                <Button color="default" size="sm" startContent={<i className='bx bxs-cart-add' />}
                    onClick={addFormDataItem}
                >
                    Add New Item
                </Button>
            </div>
            
        </div>
    )
}