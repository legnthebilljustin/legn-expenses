import { AddExpenses, ExpensesList } from "@/components";
import { Tab, Tabs } from "@nextui-org/react";
import { useState } from "react";

const EXPENSES_TABS = {
    LIST: "list",
    ADD_FORM: "addForm"
} as const

type TabSelectionType = typeof EXPENSES_TABS[keyof typeof EXPENSES_TABS]

export default function Expenses() {
    const [selected, setSelected] = useState<TabSelectionType>(EXPENSES_TABS.LIST)

    const handleChange = (key: any) => {
        setSelected(key)
    }
    return (
        <Tabs aria-label="expensesOptions" selectedKey={selected} onSelectionChange={handleChange}>
            <Tab key={EXPENSES_TABS.LIST}
                title={
                    <div className="flex items-center space-x-2">
                        <i className='bx bxs-book-content'></i>
                        <span>Expenses List</span>
                    </div>
                } 
            >
                <ExpensesList />
            </Tab>
            <Tab key={EXPENSES_TABS.ADD_FORM}
                title={
                    <div className="flex items-center space-x-2">
                        <i className="bx bx-folder-plus" ></i>
                        <span>Add Expenses Form</span>
                    </div>
                }
            >
                <AddExpenses />
            </Tab>
        </Tabs>
    )
}