import { isPositiveNumber } from "@/utils/misc"

type Props = {
    amount: number
    percentage: number
    showAmount: boolean
}

export default function PNLIndicator({ amount, percentage, showAmount }: Props) {
    const isPositive = isPositiveNumber(percentage)
    const textColor = isPositive ? "text-green-300" : "text-red-400"
    return (
        <>
            <div className={textColor}>
                { showAmount && <span>{ amount }</span>}
                { percentage || "-" }% 
                { isPositive ? <i className='bx bx-chevrons-up' /> : <i className='bx bx-chevrons-down' />}
            </div>
        </>
    )
}