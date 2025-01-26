import * as z from "zod"

import { CARD_STATEMENT_PAYMENT_STATUS } from "@/constants/others"
import { zodValidateDateOrTimestamp } from "@/utils/service"


export const StatementOfAccountSchema = z.object({
    status: z.nativeEnum(CARD_STATEMENT_PAYMENT_STATUS),
    billingDate: zodValidateDateOrTimestamp(),
    dueDate: zodValidateDateOrTimestamp()
})

export type FirestoreStatementOfAccount = z.infer<typeof StatementOfAccountSchema>