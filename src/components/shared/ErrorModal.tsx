import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { closeErrorModal } from "../../state/errorSlice";
import { RootState } from "@/state/store";

export default function ErrorModal() {
    const dispatch = useDispatch()
    const { isOpen, message, code } = useSelector((state: RootState) => state.error)

    const handleCloseErrorModal = () => dispatch(closeErrorModal())

    const handleErrorDisplay = () => {
        let errorHeading = ""
        switch (code) {
            case 400:
                errorHeading = "Unable to process request."
                break;
            
            case 401:
                errorHeading = "Unauthorized access."
                break;
            
            case 403:
                errorHeading = "Unauthorized access."
                break;

            case 404:
                errorHeading = "Requested resource not found."
                break;
        
            default:
                errorHeading = "Oops! Something went wrong."
                break;
        }

        return errorHeading
    }

    return (
        <Modal backdrop="blur" size="sm"
            isOpen={isOpen} onClose={() => handleCloseErrorModal()}
            placement="top-center"
            className="py-4 dark"
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="text-red-700">{ handleErrorDisplay() }</ModalHeader>
                        <ModalBody>
                            <p className="text-white-500">{ message || "We cannot process your request as of this time." }</p>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}