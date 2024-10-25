import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"

type Props = {
    message: string
    isOpen: boolean
}

export default function NotificationModal({ isOpen, message }: Props) {
    const { onClose } = useDisclosure()

    return (
        <Modal backdrop="blur" size="xs" isOpen={isOpen} onClose={onClose}
            placement="top-center"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Notification!</ModalHeader>
                        <ModalBody>
                            <p>{ message }</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button size="sm" color="primary" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}