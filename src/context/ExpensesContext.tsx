import { useFetchExpenses } from "@/hooks";
import { ExpensesItemType, GroupedExpensesType } from "@/types/expenses";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

interface ExpensesContextType {
    groupedExpensesList: GroupedExpensesType[]
    updateExpensesItem: (updatedExpense: ExpensesItemType) => void
    isLoading: boolean,
    isLoadingAdditional: boolean,
    isAllExpensesFetched: boolean
    loadNextPage: () => void
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined)

export function ExpensesProvider({ children }: PropsWithChildren) {
    const { expenses, 
        isLoading, 
        isLoadingAdditional, 
        isAllExpensesFetched, 
        loadNextPage 
    } = useFetchExpenses()
    const [groupedExpensesList, setGroupedExpensesList] = useState<GroupedExpensesType[]>([]);

    useEffect(() => {
        if (expenses) {
            setGroupedExpensesList(expenses)
        }
    }, [expenses])

    const updateExpensesItem = (updatedExpense: ExpensesItemType) => {
        setGroupedExpensesList((prevExpensesList) => 
            prevExpensesList.map((group: GroupedExpensesType) => {
                const expenseExists = group.expenses.some(expense => expense.id === updatedExpense.id)

                if (!expenseExists) return group;

                return {
                    ...group,
                    expenses: group.expenses.map((expense) =>
                        expense.id === updatedExpense.id ? { ...expense, ...updatedExpense } : expense
                    ),
                };
            }) 
        )
    }

    return (
        <ExpensesContext.Provider value={{ 
            groupedExpensesList, 
            updateExpensesItem,
            isLoading, isLoadingAdditional,
            isAllExpensesFetched, loadNextPage
            
        }}>
            { children }
        </ExpensesContext.Provider>
    )
}

export function useExpenses() {
    const context = useContext(ExpensesContext)

    if (!context) {
        throw new Error("useExpenses must be used within an ExpensesProvider");
    }

    return context
}