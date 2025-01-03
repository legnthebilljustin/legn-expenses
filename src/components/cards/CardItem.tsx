import { CardActionProps } from "@/pages/Cards"
import { CONFIRMATION_TYPES } from "@/state/confirmationSlice"
import { CardDetailsType } from "@/types/cards"
import { Button, Card, CardBody, Chip, Tooltip } from "@nextui-org/react"

type Props = {
    card: CardDetailsType | any
    onAction: Function
}

export default function CardItem({ card, onAction }: Props) {
    const isPaid = card.isPaid
    const handleMarkAsPaid = () => {

        const dataToEmit = {
            type: CONFIRMATION_TYPES.ACTION,
            card: card
        } as CardActionProps

        onAction(dataToEmit)
    }

    return <>
        <Card className="px-4 py-2 max-w-[400px]">
            <CardBody>
            <div className="w-full flex justify-between">
                    <div className="font-bold" style={{ color: card.color }}>{ card.name }</div>
                    {isPaid ? <Chip size="sm" variant="flat" color="success">Paid</Chip>
                        : <Chip size="sm" variant="flat">Pending</Chip>
                    }
                </div>
                <p className="text-xs text-gray-400">Billing every { card.billingDay }th of the month</p>
                <div className="flex justify-between mt-4">
                <div>
                    <div className="text-xs uppercase font-bold text-gray-400">Due Date</div>
                    <div className="text-sm font-light">{ card.dueDate }</div>
                </div>
                    <div>
                        <Tooltip size="sm" key={1} content="Delete" className="dark bg-red-800">
                            <Button isIconOnly size="sm" radius="full" className="bg-red-800 mr-2">
                                <i className='bx bxs-trash-alt' ></i>
                            </Button>
                        </Tooltip>
                        <Tooltip size="sm" key={2} content="Mark as Paid" className="bg-green-600">
                            <Button isIconOnly size="sm" radius="full" className="bg-green-600"
                                isDisabled={isPaid}
                                onClick={() => handleMarkAsPaid()}
                            >
                                <i className='bx bxs-wallet'></i>
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </CardBody>
        </Card>
    </>
}