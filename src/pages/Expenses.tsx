import { AddExpenses, ExpensesDashboard, ExpensesList } from "@/components";
import { Tab, Tabs } from "@nextui-org/react";
import { ReactNode, useState } from "react";

const EXPENSES_TABS = {
    LIST: "list",
    ADD_FORM: "addForm",
    DASHBOARD: "dashboard"
} as const

type TabSelectionType = typeof EXPENSES_TABS[keyof typeof EXPENSES_TABS]

type TabItem = {
    key: TabSelectionType
    label: string
    icon: ReactNode
    component: ReactNode
}

export default function Expenses() {
    const [selected, setSelected] = useState<TabSelectionType>(EXPENSES_TABS.DASHBOARD)

    const tabs: TabItem[] = [
        {
            key: EXPENSES_TABS.DASHBOARD,
            label: "Dashboard",
            icon: <i className='bx bx-home-alt' />,
            component: <ExpensesDashboard />
        },
        {
            key: EXPENSES_TABS.LIST,
            label: "Expenses List",
            icon: <i className='bx bxs-book-content' />,
            component: <ExpensesList />
        },
        {
            key: EXPENSES_TABS.ADD_FORM,
            label: "Add Expenses",
            icon: <i className='bx bx-folder-plus' />,
            component: <AddExpenses />
        }
    ]

    const handleChange = (key: any) => {
        setSelected(key)
    }

    return (
        <Tabs aria-label="expensesOptions" color="primary" selectedKey={selected} onSelectionChange={handleChange}>
            {tabs.map(({ key, label, icon, component}: TabItem) => (
                <Tab key={key}
                    title={
                        <div className="flex items-center space-x-2">
                            { icon }
                            <span>{ label }</span>
                        </div>
                    } 
                >
                    { component }
                </Tab>
            ))}
        </Tabs>
    )
}