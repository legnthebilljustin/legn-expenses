import { closeConfirmationModal, confirmAction, CONFIRMATION_TYPES } from "@/state/confirmationSlice";
import { RootState } from "@/state/store";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";

export default function ConfirmActionModal() {
    const dispatch = useDispatch()
    const { isOpen, message, type } = useSelector((state: RootState) => state.confirmation)
    
    const handleConfirmationModalClose = () => {
        dispatch(closeConfirmationModal())
    }

    const handleActionConfirmation = () => {
        dispatch(confirmAction())
    }

    return (
        <Modal className="dark pa-4" size="sm"
            isDismissable={false}
            isOpen={isOpen}
            onClose={handleConfirmationModalClose}
            hideCloseButton
        >
            
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader>{ type === CONFIRMATION_TYPES.ACTION ? "Confirm Action" : "Delete this item?"}</ModalHeader>
                        <ModalBody>
                            <p className="text-sm">{ message }</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button size="sm" color="danger" variant="flat" onClick={handleConfirmationModalClose}>Cancel</Button>
                            <Button size="sm" color="primary" onClick={handleActionConfirmation}>Confirm</Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}