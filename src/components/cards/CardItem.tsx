import { CardsWithStatementType } from "@/types/cards"
import { Button, Card, CardBody, Tooltip } from "@nextui-org/react"
import PaymentStatus from "./PaymentStatus"
import { CARD_STATEMENT_PAYMENT_STATUS } from "@/constants/others"
import { PayStatementProps } from "@/hooks/cards/usePayStatement"

type Props = {
    card: CardsWithStatementType
    onPayCardStatement: Function
}

export default function CardItem({ card, onPayCardStatement }: Props) {
    const { status, dueDate, id } = card.statement

    const markLatestStatementAsPaid = () => {
        const dataToEmit = {
            statementUid: id,
            cardName: card.name,
            cardUid: card.id
        } as PayStatementProps

        onPayCardStatement(dataToEmit)
    }

    const disableMakePaymentButton = () => status === CARD_STATEMENT_PAYMENT_STATUS.PAID || status === CARD_STATEMENT_PAYMENT_STATUS.PENDING

    return <>
        <Card className="px-4 py-2 max-w-[400px]">
            <CardBody>
            <div className="w-full flex justify-between">
                    <div className="font-bold" style={{ color: card.color }}>{ card.name }</div>
                    <PaymentStatus status={status} />
                </div>
                <p className="text-xs text-gray-400">Billing every { card.billingDay }th of the month</p>
                <div className="flex justify-between mt-4">
                <div>
                    <div className="text-xs uppercase font-bold text-gray-400">Due Date</div>
                    <div className="text-sm font-light">{ dueDate }</div>
                </div>
                    <div>
                        <Tooltip size="sm" key={1} content="Delete" className="dark bg-red-800">
                            <Button isIconOnly size="sm" radius="full" className="bg-red-800 mr-2">
                                <i className='bx bxs-trash-alt' ></i>
                            </Button>
                        </Tooltip>
                        <Tooltip size="sm" key={2} content="Mark as Paid" className="bg-green-600">
                            <Button isIconOnly size="sm" radius="full" className="bg-green-600"
                                isDisabled={disableMakePaymentButton()}
                                onClick={markLatestStatementAsPaid}
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