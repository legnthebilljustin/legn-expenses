import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { useDispatch, useSelector } from "react-redux"
import { closeNotification } from "@/state/notificationSlice"

export default function NotificationModal() {
    const dispatch = useDispatch()
    const { isOpen, message } = useSelector((state: any) => state.notification)

    const handleNotificationClose = () => {
        dispatch(closeNotification())
    }

    return (
        <Modal className="dark" backdrop="blur" size="xs"
            isOpen={isOpen} onClose={() => handleNotificationClose()}
            placement="top-center"
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader>Notification!</ModalHeader>
                        <ModalBody>
                            <p>{ message }</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button size="sm" color="primary" onPress={() => handleNotificationClose()}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}