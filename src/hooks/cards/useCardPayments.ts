import { addPaymentToCard } from "@/apis/cards"

type ReturnTypes = {
    markCardAsPaid: (userUid: string, cardId: string, billingMonth: number, billingDay: number) => any
}

export const useCardPayment = (): ReturnTypes => {

    const markCardAsPaid = async(userUid: string, cardId: string, billingMonth: number, billingDay: number) => {
        return await addPaymentToCard(userUid, cardId, billingMonth, billingDay)

    }

    return {
        markCardAsPaid
    }
}