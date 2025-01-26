import { useAddExpenses, useFetchCards } from "@/hooks";
import { Button, DatePicker, Spinner } from "@nextui-org/react";
import ExpensesInputGroup from "./ExpensesInputGroup";
import { CARDS_FETCH_TYPE } from "@/constants/others";

export default function AddExpenses() {
    const { cardsForDropdown, isLoading } = useFetchCards(CARDS_FETCH_TYPE.SELECT_DROPDOWN)
    const {
        formData,
        purchaseDate,
        handleDateInputChange,
        handleInputChange,
        handleCardSelectionInputChange,
        addFormDataItem,
        handleExpensesFormSubmit,
        removeFormDataItem
    } = useAddExpenses({ creditCardsList: cardsForDropdown })

    if (isLoading) {
        return <Spinner label="Loading expenses form..." />
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
            {formData.map((item, index) => 
                <ExpensesInputGroup key={index} 
                    item={item} index={index} 
                    onChange={handleInputChange}
                    onCardSelectChange={handleCardSelectionInputChange}
                    creditCardsList={cardsForDropdown}
                    removeFormDataItem={removeFormDataItem}
                />
            )}

            <div className="mt-8 mb-4">
                <Button color="primary" size="sm" className="mr-2"
                    startContent={<i className='bx bxs-save'></i>}
                    onClick={handleExpensesFormSubmit}
                    isDisabled={formData.length === 0}
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