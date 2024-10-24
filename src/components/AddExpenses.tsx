import { Button, CalendarDate, DatePicker } from "@nextui-org/react"
import ExpensesInputGroup from "./ExpensesInputGroup"
import { ChangeEvent, useCallback, useMemo, useState } from "react"
import { addExpenses } from "../apis/expenses"

export type ExpensesInputGroupType = {
    price: number | string
    itemName: string
    purchaseDate: Date | null
}

export default function AddExpenses() {
    const [purchaseDate, setPurchaseDate] = useState<CalendarDate | null>(null)
    const [formData, setFormData] = useState<ExpensesInputGroupType[]>([])

    const parsedPurchaseDate: Date | null = useMemo(() => {
        if (purchaseDate !== null) {
            const { year, month, day } = purchaseDate
            return new Date(year, month - 1, day)
        }
        return null
    }, [purchaseDate])

    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = event.target
        const updatedFormData = [...formData]

        updatedFormData[index] = {
            ...updatedFormData[index],
            [name]: value
        }

        setFormData(updatedFormData)
    }, [formData])

    const addFormDataItem = () => {
        const newExpensesItem: ExpensesInputGroupType = { 
            price: 0, 
            itemName: "",
            purchaseDate: parsedPurchaseDate
        }
        setFormData(prevFormData => [...prevFormData, newExpensesItem])
    }

    const handleDateInputChange = (date: CalendarDate | null) => {
        setPurchaseDate(date)
    }

    const handleSubmit = async() => {
        addExpenses(formData)
    }

    return (
        <div>
            <div className="mb-2 mt-6">Please select a date to start adding items.</div>
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
                    onClick={addFormDataItem} isDisabled={purchaseDate === null}
                >
                    Add New Item
                </Button>
            </div>
            
        </div>
    )
}