import { useEditExpenses } from "@/hooks";
import { EditExpensesDetailsType } from "@/types/expenses";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

type Props = {
    expensesItem: EditExpensesDetailsType,
    isOpen: boolean,
    onModalClose: () => void
}

export default function EditExpensesForm({ expensesItem, isOpen, onModalClose }: Props) {
    const {
        isEditSubmitted,
        handleInputChange,
        handleFormSubmit,
        formData
    } = useEditExpenses(expensesItem)

    return (
        <Modal hideCloseButton size="xs" isOpen={isOpen}>
            <ModalContent>
                <ModalHeader>
                    Edit Expense
                </ModalHeader>
                <ModalBody>
                    <Input
                        size="sm"
                        isRequired
                        type="number"
                        name="price"
                        label="Price"
                        value={formData.price.toString()}
                        onChange={handleInputChange}
                        isDisabled={isEditSubmitted}
                    />
                    <Input
                        size="sm"
                        isRequired
                        type="text"
                        name="itemName"
                        label="Item Name"
                        value={formData.itemName}
                        onChange={handleInputChange}
                        isDisabled={isEditSubmitted}
                        className="capitalize"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="default" size="sm" className="mr-2"
                        onPress={onModalClose}
                    >
                        Close
                    </Button>
                    <Button color="primary" size="sm"
                        isDisabled={isEditSubmitted}
                        onClick={handleFormSubmit}
                    >
                        { isEditSubmitted ? "Loading..." : "Update" }
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}