import { useAddCards } from "@/hooks";
import { RootState } from "@/state/store";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { useSelector } from "react-redux";

export default function AddCardForm() {
    const { uid } = useSelector((state: RootState) => state.auth)
    const {isOpen, onOpen, onOpenChange} = useDisclosure()
    const {
        formData,
        handleInputChange,
        handleAddCardFormSubmit,
        isFormSubmitted
    } = useAddCards()

    const handleFormSubmit = () => {
        if (uid) {
            handleAddCardFormSubmit(uid)
        }
    }
    return (
        <>
            <Button onPress={onOpen} size="sm" startContent={<i className='bx bxs-credit-card' ></i>}>Add a new Credit Card</Button>
            <Modal hideCloseButton size="sm" className="dark" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Add a new Credit Card</ModalHeader>
                            <ModalBody>
                                <Input size="sm" isRequired
                                    name="name" label="Card Name" className="mb-2"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                                <Input size="sm" isRequired
                                    type="number"
                                    name="billingDay" label="Billing Day" className="mb-2"
                                    value={formData.billingDay?.toString()}
                                    onChange={handleInputChange}
                                />
                                <Input size="sm" isRequired
                                    type="number"
                                    name="dueDaysAfterBilling" label="Due Days After Billing" className="mb-2"
                                    value={formData.dueDaysAfterBilling?.toString()}
                                    onChange={handleInputChange}
                                />
                                <Input size="sm" isRequired type="colorpicker"
                                    name="color" label="Color" className="mb-2"
                                    value={formData.color}
                                    onChange={handleInputChange}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button size="sm" color="danger" variant="light"        
                                    onPress={onClose}
                                    isDisabled={isFormSubmitted}
                                >
                                    Close
                                </Button>
                                <Button size="sm" color="primary"
                                    onClick={handleFormSubmit}
                                    isDisabled={isFormSubmitted}
                                >
                                    Submit
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}